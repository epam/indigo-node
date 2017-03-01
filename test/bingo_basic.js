/****************************************************************************
 * Copyright (C) 2015-2016 EPAM Systems
 *
 * This file is part of Indigo-Node binding.
 *
 * This file may be distributed and/or modified under the terms of the
 * GNU General Public License version 3 as published by the Free Software
 * Foundation and appearing in the file LICENSE.md  included in the
 * packaging of this file.
 *
 * This file is provided AS IS with NO WARRANTY OF ANY KIND, INCLUDING THE
 * WARRANTY OF DESIGN, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 ***************************************************************************/

/* declaration of modules  */
var test = require('tape');
var tmp = require('tmp');

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var local = path.join.bind(path, __dirname);

var Indigo = require("../indigo").Indigo;
var Bingo = require("../bingo").Bingo;
var BingoException = require("../bingo").BingoException;

var indigo = new Indigo();

var searchSub = function (bingo, q, options) {
	var resultIds = [];
	var result = bingo.searchSub(q, options);
	while (result.next())
		resultIds.push(result.getCurrentId());
	return resultIds;
};

var searchExact = function (bingo, q, options) {
	var result = bingo.searchExact(q, options);
	var resultIds = [];
	while (result.next())
		resultIds.push(result.getCurrentId());
	return resultIds;
};


var searchSim = function (bingo, q, minSim, maxSim, metric) {
	var result = bingo.searchSim(q, minSim, maxSim, metric);
	// console.log("Search sim: %d %d %d", result.estimateRemainingResultsCount(), result.estimateRemainingResultsCountError(), result.estimateRemainingTime());
	while (result.next()) {
		//console.log(result.getCurrentId(), result.getCurrentSimilarityValue());
		try {
			var rm = result.getIndigoObject();
		} catch (e) {
			//console.log("BingoException: %s", e.message);
		}
	}
	result.close();
};

var tmpDir = tmp.dirSync({ template: local('/tmp-XXXXXX'), unsafeCleanup: true });

test('Creating temporary database', function (t) {
	//console.log('\n#### - Bingo-basic test - ####\n');

	t.plan(5);
	var bingo = Bingo.createDatabaseFile(indigo, tmpDir.name, 'molecule');
	t.ok(bingo.id >= 0, 'bd should be created');
	bingo.insert(indigo.loadMolecule('C1CCCCC1'));
	bingo.insert(indigo.loadMolecule('C1CCNCC1'));
	var insertedIndex = bingo.insert(indigo.loadMolecule('C1CCNCC1'), 100);
	t.equal(insertedIndex, 100, 'should be right id');
	bingo.optimize();
	var qm = indigo.loadQueryMolecule('C');
	t.deepEquals(searchSub(bingo, qm), [0, 1, 100]);
	bingo.delete(insertedIndex);
	t.deepEquals(searchSub(bingo, qm), [0, 1]);

	t.throws(() => bingo.delete(31459), BingoException, 'delete: should be exception, incorrect index');
	bingo.close();
});

test('Loading existing database', function (t) {
	t.plan(2);
	var loadBingo = Bingo.loadDatabaseFile(indigo, tmpDir.name);
	var m = indigo.loadMolecule('C1CCCCC1');
	searchSim(loadBingo, m, 0.9, 1, 'tanimoto');
	searchSim(loadBingo, m, 0.9, 1, 'tversky');
	searchSim(loadBingo, m, 0.9, 1, 'tversky 0.1 0.9');
	searchSim(loadBingo, m, 0.9, 1, 'tversky 0.9 0.1');
	searchSim(loadBingo, m, 0.9, 1, 'euclid-sub');

	t.throws(() => Bingo.loadDatabaseFile(indigo, 'idonotexist', 'molecule'), BingoException, 'should be exception, non-exist');
	loadBingo.close();

	t.throws(() => loadBingo.insert(m), BingoException, 'should be exception, closed BD');
});

test('Simple exact search', function (t) {
	t.plan(2);
	var bingo = Bingo.createDatabaseFile(indigo, tmpDir.name, 'molecule');
	var mol1 = indigo.loadMolecule("ICCCCOC(=O)C1=CC([N+]([O-])=O)=C([N+]([O-])=O)C=C1");
	var mol2 = indigo.loadMolecule("CCCC");
	bingo.insert(mol1);
	bingo.insert(mol2);
	t.deepEquals(searchExact(bingo, mol1), [0]);
	t.deepEquals(searchExact(bingo, mol2), [1]);

	bingo.close();
	tmpDir.removeCallback();
});

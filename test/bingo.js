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
var test = require('tap').test;
var tmp = require('tmp');

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var local = path.join.bind(path, __dirname);

var Indigo = require("../indigo").Indigo;
var Bingo = require("../bingo").Bingo;

var indigo = new Indigo();

var smiles = ["CCCC1CCCCC1CPC", "CCC1CCNCC1CPC"];
var ids = [];
//var entry = 10000;
var entry = 10;

var tmpDir = tmp.dirSync({ template: local('/tmp-XXXXXX'), unsafeCleanup: true });

test('Create database', function (t) {
	// console.log('\n#### - Bingo database test - ####\n');

	t.plan(2);
	var bingo = Bingo.createDatabaseFile(indigo, tmpDir.name, 'molecule');
	t.ok(bingo.id >= 0, 'bd should be created');
	for (var i = 0; i < entry; i++) {
		for (var sm of smiles) {
			var id = bingo.insert(indigo.loadMolecule(sm));
			ids[id] = sm;
		}
	}
	t.doesNotThrow(() => bingo.optimize, 0, 'should be more or equal to zero');
	bingo.close();
});

test('Append to the database', function (t) {
	t.plan(2);
	var bingo = Bingo.loadDatabaseFile(indigo, tmpDir.name);
	t.ok(bingo.id >= 0, 'bd should be loaded');
	var smiles2 = ["C1CPCCC1", "C1CONCC1"];
	var lastid = ids.length;
	for (var i = 0; i < entry; i++) {
		for (var sm of smiles2) {
			lastid += 2; // Skip space on purpose
			var id = bingo.insert(indigo.loadMolecule(sm), lastid);
			ids[id] = sm;
		}
	}
	t.equal(lastid, 60);
	bingo.close();
});

test('Validate and search', function(t) {
	t.plan(5);
	var bingo = Bingo.loadDatabaseFile(indigo, tmpDir.name, "read_only:true");
	var objSmiles = [];
	var refSmiles = [];
	for (var id in ids) {
		var obj = bingo.getRecordById(id);
		var ref = indigo.loadMolecule(ids[id]);

		objSmiles.push(obj.canonicalSmiles());
		refSmiles.push(ref.canonicalSmiles());
	}
	t.deepEquals(objSmiles, refSmiles, 'should be identical smiles');

	var smiles2 = ["C1CPCCC1", "C1CONCC1"];
	for (var sm of smiles.concat(smiles2)){
		var q = indigo.loadQueryMolecule(sm);
		var search = bingo.searchSub(q);
		var found = [];
		while (search.next()){
			var id = search.getCurrentId();
			found.push(id);
		}
		var should_find = [];
		for (var id in ids) {
			if (ids[id] == sm)
				should_find.push(id);
		}
		t.equals(found.toString(), should_find.toString());
	}
	bingo.close();

	tmpDir.removeCallback();
});

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
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var local = path.join.bind(path, __dirname);

var Indigo = require("../indigo-node/indigo");
var indigo = new Indigo({ exception: true });
var Bingo = require("../indigo-node/bingo");



var searchSub = function (bingo, q, options) {
	console.log("** searchSub(%s) **", q.smiles());
	var result = bingo.searchSub(q, options);
	while (result.next())
		console.log(result.getCurrentId());
};

var searchExact = function (bingo, q, options) {
	console.log("** searchExact(%s) **", q.smiles());
	var result = bingo.searchExact(q, options);
	while (result.next())
		console.log(result.getCurrentId());
};


var searchSim = function (bingo, q, minSim, maxSim, metric) {
	console.log("** searchSim(%s) **", q.smiles());
	var result = bingo.searchSim(q, minSim, maxSim, metric);
	console.log("%d %d %d", result.estimateRemainingResultsCount(), result.estimateRemainingResultsCountError(), result.estimateRemainingTime());
	while (result.next()) {
		console.log(result.getCurrentId());
		console.log(result.getCurrentSimilarityValue());
		try {
			var rm = result.getIndigoObject();
			console.log(rm.smiles());
		}
		catch (e) {
			console.log("BingoException: %s", e.message);
		}
	}
	result.close();
}

console.log("*** Creating temporary database ****");
var bingo = Bingo.createDatabaseFile(indigo, local('tempdb'), 'molecule');
console.log(bingo.version());
var m = indigo.loadMolecule('C1CCCCC1');
bingo.insert(m);
var m = indigo.loadMolecule('C1CCNCC1');
bingo.insert(m);
var insertedIndex = bingo.insert(m, 100);
console.log("Inserted index: %d", insertedIndex);
bingo.optimize();
console.log("Index optimized");
var qm = indigo.loadQueryMolecule('C');
searchSub(bingo, qm);
bingo.delete(insertedIndex);
searchSub(bingo, qm);

console.log("*** Deleting record with incorrect index ***");
try {
	bingo.delete(31459);
}
catch (e) {
	console.log("BingoException: %s", e.message);
}

bingo.close();

console.log("*** Loading existing database ****");
var bingo = Bingo.loadDatabaseFile(indigo, local('tempdb'));
var m = indigo.loadMolecule('C1CCCCC1');
searchSim(bingo, m, 0.9, 1, 'tanimoto');
searchSim(bingo, m, 0.9, 1, 'tversky');
searchSim(bingo, m, 0.9, 1, 'tversky 0.1 0.9');
searchSim(bingo, m, 0.9, 1, 'tversky 0.9 0.1');
searchSim(bingo, m, 0.9, 1, 'euclid-sub');

try {
	console.log("*** Loading non-existent database ***");
	var bingo = Bingo.loadDatabaseFile(indigo, 'idonotexist', 'molecule');
}
catch (e) {
	console.log("BingoException: %s", e.message);
}

console.log("*** Using closed database ***");
bingo.close();
try {
	var m = indigo.loadMolecule('C');
	bingo.insert(m);
}
catch (e) {
	console.log("BingoException: %s, name: %s", e.message, e.name);
}

console.log("*** Simple exact search ****");
var bingo = Bingo.createDatabaseFile(indigo, local('tempdb'), 'molecule');
var mol1 = indigo.loadMolecule("ICCCCOC(=O)C1=CC([N+]([O-])=O)=C([N+]([O-])=O)C=C1");
var mol2 = indigo.loadMolecule("CCCC");
bingo.insert(mol1);
bingo.insert(mol2);
searchExact(bingo, mol1);
searchExact(bingo, mol2);
bingo.close()

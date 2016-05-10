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

var dbname = local('append-mol-db');
var smiles = ["CCCC1CCCCC1CPC", "CCC1CCNCC1CPC"];
var ids = [];

console.log("Create database");
var bingo = Bingo.createDatabaseFile(indigo, dbname, 'molecule');
for (var i = 0; i < 10000; i++) {
	for (var sm of smiles) {
		var id = bingo.insert(indigo.loadMolecule(sm));
		ids[id] = sm;
	}
}
console.log("Optimize");
var status = bingo.optimize();
bingo.close()

console.log("Append to the database");
var bingo = Bingo.loadDatabaseFile(indigo, dbname);
var smiles2 = ["C1CPCCC1", "C1CONCC1"];
lastid = ids.length;
for (var i = 0; i < 10000; i++) {
	for (var sm of smiles2) {
		lastid += 2; // Skip space on purpose
		var id = bingo.insert(indigo.loadMolecule(sm), lastid);
		ids[id] = sm;
	}
}
bingo.close();

console.log("Validate");
var bingo = Bingo.loadDatabaseFile(indigo, dbname, { options: "read_only:true" });
for (var id in ids) {
	var obj = bingo.getRecordById(id);
	var ref = indigo.loadMolecule(ids[id]);
	if (obj.canonicalSmiles() != ref.canonicalSmiles())
		console.log("Error:" + obj.smiles())
}
bingo.close();


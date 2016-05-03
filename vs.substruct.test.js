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

var indigo = require("../indigo-node/indigo");

var checkHasMatchMol = function (indigo, m, q) {
	q.aromatize();
	m.checkBadValence();
	m.checkBadValence();
	var matcher = indigo.substructureMatcher(m);
	assert(matcher.match(q) != null);
	
	var m2 = indigo.unserialize(m.serialize());
	var matcher2 = indigo.substructureMatcher(m2)
	assert(matcher2.match(q) != null);
	q.optimize();
	assert(matcher.match(q) != null);
	assert(matcher2.match(q) != null)
};

var checkHasMatch = function (indigo, targetName, queryName) {
	console.log(targetName + " " + queryName);
	var q = indigo.loadQueryMoleculeFromFile(local("../indigo-node/"+queryName));
	var m = indigo.loadMoleculeFromFile(local("../indigo-node/"+targetName));
	checkHasMatchMol(indigo, m, q);
};

console.log("***** Substructure with either and bidirectional mode *****");
indigo.setOption("stereochemistry-bidirectional-mode", true);
checkHasMatch(indigo, "molecules/either1.mol", "molecules/either1.mol");
checkHasMatch(indigo, "molecules/either1.mol", "molecules/either2.mol");
checkHasMatch(indigo, "molecules/either1.mol", "molecules/either1_query.mol");

var mol = indigo.loadMolecule('C1C=CC=CC=1');
mol.aromatize();
var q = indigo.loadQueryMolecule("C:C:C");
var m = indigo.substructureMatcher(mol).match(q);
if (m === null)
	console.log("not matched");
else
	console.log(m.highlightedTarget().smiles());

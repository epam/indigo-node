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

var testEnumTautomersForMolecule = function (molecule) {
	var iter = indigo.iterateTautomers(molecule, 'INCHI');
	var lst = [];
	for (mol of iter)
	{
		var prod = mol.clone();
		lst.push(prod.canonicalSmiles());
	}
	lst.sort();
	console.log(lst);
}

var testEnumTautomersForSDF = function (sdf_file) {
	var data = fs.readFileSync(sdf_file);
	for (var molecule of indigo.iterateSDF(indigo.loadBuffer(data)))
	{
		console.log(molecule.smiles());
		molecule.dearomatize();
		testEnumTautomersForMolecule(molecule);
		molecule.aromatize();
		testEnumTautomersForMolecule(molecule);
	}
}

console.log("This is the case when not all tautomers are found for the first time and the algorithm requires the second attempt:")
testEnumTautomersForMolecule(indigo.loadMolecule('OC1N=C2C(=NC(N)=NC(=O)2)NC(O)=1'));

console.log("Test tautomers1-small.sdf")
testEnumTautomersForSDF(local('../indigo-node/molecules/tautomers1-small.sdf'));

console.log("Test tautomers2-small.sdf")
testEnumTautomersForSDF(local('../indigo-node/molecules/tautomers2-small.sdf'));

console.log("Test tautomers1-large.sdf")
testEnumTautomersForSDF(local('../indigo-node/molecules/tautomers1-large.sdf'));

console.log("Test tautomers2-large.sdf")
testEnumTautomersForSDF(local('../indigo-node/molecules/tautomers2-large.sdf'));

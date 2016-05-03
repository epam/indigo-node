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

var testMDLCT = function () {
	var mol = indigo.loadMolecule("C(CC)CC");
	mol.layout();
	console.log(mol.mdlct());
};

var testReactionMaking = function () {
	var rxn = indigo.createReaction();
	var r1 = indigo.loadMoleculeFromFile(local("../indigo-node/reactions/reactant1.mol"));
	var r2 = indigo.loadMoleculeFromFile(local("../indigo-node/reactions/reactant2.mol"));
	var p1 = indigo.loadMoleculeFromFile(local("../indigo-node/reactions/product1.mol"));
	
	rxn.addReactant(r1);
	rxn.addReactant(r2);
	rxn.addProduct(p1);
	
	rxn.layout();
	rxn.saveRxnfile("result.rxn");
	
	console.log(rxn.countReactants()+ " reactants");
	console.log(rxn.countProducts()+ " products");
	console.log(rxn.countMolecules()+ " total");
	for(item of rxn.iterateReactants()) {
		console.log("REACTANT:");
		console.log(item.molecularWeight());
		console.log(item.mostAbundantMass());
		console.log(item.monoisotopicMass());
		console.log(item.smiles());
	}
}

var componentSmiles = function (mol) {
	if (mol.countComponents() > 1) {
		items = [];
		for (var comp of mol.iterateComponents())
		{
			var item = comp.clone().canonicalSmiles();
			var ext = item.search(" |");
			if (ext > 0) item = item.substring(0,ext);
			items.push(item);
		}
		return items.sort().join('.')
	}
	return mol.canonicalSmiles()
}

var testCanonical = function () {
	for(var m of indigo.iterateSDFile(local("../indigo-node/molecules/test.sdf")))
		console.log(componentSmiles(m));
};

var TestReactingCenters = function () {
	console.log("*** Test 1 ***");
	var rxn = indigo.createReaction();
	rxn.addProduct(indigo.loadMolecule("CCCC"));
	rxn.addReactant(indigo.loadMolecule("CCCC"));
	console.log(rxn.smiles());
	console.log("reacting centers:");
	for (var m of rxn.iterateMolecules())
		for (var b of m.iterateBonds())
			console.log(rxn.reactingCenter(b));
	for (var m of rxn.iterateMolecules())
		for (var b of m.iterateBonds())
			rxn.setReactingCenter(b, indigo.CENTER | indigo.UNCHANGED);
	console.log("modified centers:");
	for (var m of rxn.iterateMolecules())
		for (var b of m.iterateBonds())
		console.log(rxn.reactingCenter(b));
};

var TestAAM = function () {
	console.log("*** Test AAM ***");
	var rxn2 = indigo.loadReaction("CC=O>>CCO");
	console.log("reaction smiles " + rxn2.smiles())
	for (var m of rxn2.iterateMolecules())
		for (var b of m.iterateBonds())
			rxn2.setReactingCenter(b, indigo.UNCHANGED | indigo.ORDER_CHANGED);
	rxn2.automap("DISCARD");
	console.log("aam reaction smiles for given RC " + rxn2.smiles());
};

var TestCorrectRCenters = function () {
	console.log("*** Test correct reacting centers ***");
	var rxn = indigo.loadReaction("[CH3:7][CH2:6][CH2:1][CH2:2]O[CH2:4][CH2:5][CH2:8][CH3:9]>>[CH3:7][CH2:6][CH:1]=[CH:2]C[CH2:4][CH2:5][C:8]#[CH:9]");
	console.log("reacting centers:");
	for (var m of rxn.iterateMolecules())
		for (var b of m.iterateBonds())
		console.log(rxn.reactingCenter(b));
	rxn.correctReactingCenters()
	console.log("modified centers:");
	for (var m of rxn.iterateMolecules())
		for (var b of m.iterateBonds())
			console.log(rxn.reactingCenter(b));
	console.log(rxn.rxnfile());
};

TestReactingCenters();
TestAAM();
TestCorrectRCenters();

testReactionMaking();
testMDLCT();
testCanonical();

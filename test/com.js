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

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var local = path.join.bind(path, __dirname);

var Indigo = require("../indigo").Indigo;
var indigo = new Indigo();

test('Test 1', function (t) {
    console.log('\n#### - Com test - ####\n');
	t.plan(2);
	var rxn = indigo.createReaction();
	rxn.addProduct(indigo.loadMolecule("CCCC"));
	rxn.addReactant(indigo.loadMolecule("CCCC"));
	var reactingCenters = [];
	for (var m of rxn.iterateMolecules())
		for (var b of m.iterateBonds())
			reactingCenters.push(rxn.reactingCenter(b));
	t.deepEquals(reactingCenters, [0,0,0,0,0,0], 'check reacting centers');
	for (var m of rxn.iterateMolecules())
		for (var b of m.iterateBonds())
			rxn.setReactingCenter(b, indigo.CENTER | indigo.UNCHANGED);
	var modifiedCenters = [];
	for (var m of rxn.iterateMolecules())
		for (var b of m.iterateBonds())
			modifiedCenters.push(rxn.reactingCenter(b));
	t.deepEquals(modifiedCenters, [3,3,3,3,3,3], 'check modified centers');
});

test('Test AAM', function (t) {
	t.plan(1);
	var rxn2 = indigo.loadReaction("CC=O>>CCO");
	for (var m of rxn2.iterateMolecules())
		for (var b of m.iterateBonds())
			rxn2.setReactingCenter(b, indigo.UNCHANGED | indigo.ORDER_CHANGED);
	rxn2.automap("DISCARD");
	var correct = '[CH3:1][CH:2]=[O:3]>>[CH3:1][CH2:2][OH:3]';
	t.equals(rxn2.smiles(), correct, 'aam reaction smiles for given RC');
});

test('Test correct reacting centers', function (t) {
	t.plan(2);
	var rxn = indigo.loadReaction("[CH3:7][CH2:6][CH2:1][CH2:2]O[CH2:4][CH2:5][CH2:8][CH3:9]>>[CH3:7][CH2:6][CH:1]=[CH:2]C[CH2:4][CH2:5][C:8]#[CH:9]");
	var reactingCenters = [];
	for (var m of rxn.iterateMolecules())
		for (var b of m.iterateBonds())
			reactingCenters.push(rxn.reactingCenter(b));
	t.deepEquals(reactingCenters, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 'check reacting centers');
	rxn.correctReactingCenters();
	var modifiedCenters = [];
	for (var m of rxn.iterateMolecules())
		for (var b of m.iterateBonds())
			modifiedCenters.push(rxn.reactingCenter(b));
	t.deepEquals(modifiedCenters, [2,2,8,4,4,2,2,8,2,2,8,4,4,2,2,8], 'check modified centers');
	rxn.rxnfile();
});

test('Test reaction making', function(t) {
	t.plan(2);
	var rxn = indigo.createReaction();
	var r1 = indigo.loadMoleculeFromFile(local("fixtures/reactant1.rxn"));
	var r2 = indigo.loadMoleculeFromFile(local("fixtures/reactant2.rxn"));
	var p1 = indigo.loadMoleculeFromFile(local("fixtures/product1.rxn"));

	rxn.addReactant(r1);
	rxn.addReactant(r2);
	rxn.addProduct(p1);

	rxn.layout();
	rxn.saveRxnfile("result.rxn");
	t.deepEquals([rxn.countReactants(), rxn.countProducts(), rxn.countMolecules()], [2,1,3]);
	var correct = [
		[105.98844146728516, 105.96427917480469, 105.96427917480469, 'O=C([O-])[O-].[Na+].[Na+]'],
		[506.5006408691406, 506.1576843261719, 506.1576843261719, 'C1C=C(C2(O)OC(=O)C(C3C=C4OCOC4=CC=3)=C2CC2C=C(OC)C(OC)=C(OC)C=2)C=CC=1OC']
	];
	var result = [];
	for(var item of rxn.iterateReactants()) {
		var ar = [];
		ar.push(item.molecularWeight());
		ar.push(item.mostAbundantMass());
		ar.push(item.monoisotopicMass());
		ar.push(item.smiles());
		result.push(ar);
	}
	t.deepEquals(result, correct);
});

test('Test MDLCT', function (t) {
	t.plan(1);
	var mol = indigo.loadMolecule("C(CC)CC");
	mol.layout();
	t.doesNotThrow(() => mol.mdlct(), Array);
});

var componentSmiles = function (mol) {
	if (mol.countComponents() > 1) {
		var items = [];
		for (var comp of mol.iterateComponents())
		{
			var item = comp.clone().canonicalSmiles();
			var ext = item.search(" |");
			if (ext > 0) item = item.substring(0,ext);
			items.push(item);
		}
		return items.sort().join('.');
	}
	return mol.canonicalSmiles();
};

test('Test Canonical', function (t) {
	t.plan(1);
	for(var m of indigo.iterateSDFile(local("fixtures/test.sdf")))
		t.doesNotThrow(() => componentSmiles(m), String);
});

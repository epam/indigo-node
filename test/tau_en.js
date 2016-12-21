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
let test = require('tape');

let assert = require('assert');
let path = require('path');
let fs = require('fs');
let local = path.join.bind(path, __dirname);

let Indigo = require("../indigo").Indigo;
let indigo = new Indigo();

let testEnumTautomersForMolecule = function (molecule) {
	let iter = indigo.iterateTautomers(molecule, 'INCHI');
	let lst = [];
	for (let mol of iter) {
		let prod = mol.clone();
		lst.push(prod.canonicalSmiles());
	}
	lst.sort();
};

let testEnumTautomersForSDF = function (sdf_file) {
	let data = fs.readFileSync(sdf_file);
	for (let molecule of indigo.iterateSDF(indigo.loadBuffer(data))) {
		molecule.dearomatize();
		testEnumTautomersForMolecule(molecule);
		molecule.aromatize();
		testEnumTautomersForMolecule(molecule);
	}
};

test('This is the case when not all tautomers are found for the first time and the algorithm requires the second attempt:', function (t) {
    console.log('\n#### - TAU_EN test - ####\n');
	t.plan(1);
	t.doesNotThrow(() => testEnumTautomersForMolecule(indigo.loadMolecule('OC1N=C2C(=NC(N)=NC(=O)2)NC(O)=1')), Array);
});

test('Test tautomers1-small.sdf:', function (t) {
    t.plan(1);
    t.doesNotThrow(() => testEnumTautomersForSDF(local('fixtures/tautomers1-small.sdf')), Array);
});

test('Test tautomers2-small.sdf:', function (t) {
    t.plan(1);
    t.doesNotThrow(() => testEnumTautomersForSDF(local('fixtures/tautomers2-small.sdf')), Array);
});

test('Test tautomers1-large.sdf:', function (t) {
    t.plan(1);
    t.doesNotThrow(() => testEnumTautomersForSDF(local('fixtures/tautomers1-large.sdf')), Array);
});

test('Test tautomers2-large.sdf:', function (t) {
    t.plan(1);
    t.doesNotThrow(() => testEnumTautomersForSDF(local('fixtures/tautomers2-large.sdf')), Array);
});

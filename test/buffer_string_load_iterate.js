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

test('SDF load string and buffer', function (t) {
	t.plan(3);
	var data = fs.readFileSync(local("fixtures/stereo_parity.sdf"));
	t.doesNotThrow(() => data.toString(), String, 'should be string');

	var str1 = '', str2 = '';
	t.doesNotThrow(() => {
		// *** SDF loadString ***
		for (var m of indigo.iterateSDF(indigo.loadString(data.toString()))) {
			str1 += m.smiles();
		}
		// *** SDF loadBuffer ***
		for (var m of indigo.iterateSDF(indigo.loadBuffer(data))) {
			str2 += m.smiles();
		}
	});
	t.equals(str1, str2, 'loadString and loadBuffer should be equal');
});

test('SMILES load string and buffer', function (t) {
	t.plan(3);
	var data = fs.readFileSync(local("fixtures/helma.smi"));
	t.doesNotThrow(() => data.toString(), String, 'should be string');

	var str1 = '', str2 = '';
	t.doesNotThrow(() => {
		// *** SDF loadString ***
		for (var m of indigo.iterateSmiles(indigo.loadString(data.toString()))) {
			str1 += m.smiles();
		}
		// *** SDF loadBuffer ***
		for (var m of indigo.iterateSmiles(indigo.loadBuffer(data))) {
			str2 += m.smiles();
		}
	});
	t.equals(str1, str2, 'loadString and loadBuffer should be equal');
});

test('CML load string and buffer', function (t) {
	t.plan(3);
	var data = fs.readFileSync(local("fixtures/tetrahedral-all.cml"));
	t.doesNotThrow(() => data.toString(), String, 'should be string');

	var str1 = '', str2 = '';
	t.doesNotThrow(() => {
		// *** SDF loadString ***
		for (var m of indigo.iterateCML(indigo.loadString(data.toString()))) {
			str1 += m.smiles();
		}
		// *** SDF loadBuffer ***
		for (var m of indigo.iterateCML(indigo.loadBuffer(data))) {
			str2 += m.smiles();
		}
	});
	t.equals(str1, str2, 'loadString and loadBuffer should be equal');
});

test('RDF load string and buffer', function (t) {
	t.plan(3);
	var data = fs.readFileSync(local("fixtures/reactions.rdf"));
	t.doesNotThrow(() => data.toString(), String, 'should be string');

	var str1 = '', str2 = '';
	t.doesNotThrow(() => {
		// *** SDF loadString ***
		for (var m of indigo.iterateRDF(indigo.loadString(data.toString()))) {
			str1 += m.smiles();
		}
		// *** SDF loadBuffer ***
		for (var m of indigo.iterateRDF(indigo.loadBuffer(data))) {
			str2 += m.smiles();
		}
	});
	t.equals(str1, str2, 'loadString and loadBuffer should be equal');
});

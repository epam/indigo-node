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

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var local = path.join.bind(path, __dirname);

var Indigo = require("../indigo").Indigo;
var indigo = new Indigo();

indigo.setOption("molfile-saving-skip-date", true);

var readCdxAndPrintInfo = function (fname){
	var data = fs.readFileSync(fname);
	var str = [];
	for (var m of indigo.iterateCDX(indigo.loadBuffer(data))) {
		str += "*****";
		str += "Smiles:";
		str += m.smiles();
		str += "Molfile:";
		str += m.molfile();
		str += "Properties:";
		for (var prop of m.iterateProperties())
			str += prop.name() +' : ' + prop.rawData();
	}
	return str;
};

test('Read CDX from file', function (t) {
	// console.log('\n#### - CDX test - ####\n');
	t.plan(2);
	t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test-multi.cdx')), String);
	t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/CDX3_4molecules_prop.cdx')), String);
});

test('Read CDX with wrong empty objects', function (t) {
	t.plan(7);
	t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test_title_0.cdx')), String);
	t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test_title_1.cdx')), String);
	t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test_title_2.cdx')), String);
	t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test_title_3.cdx')), String);
	t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test_title_4.cdx')), String);
	t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test_title_5.cdx')), String);
	t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test_title_6.cdx')), String);
});

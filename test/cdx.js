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
var indigo = new Indigo();

indigo.setOption("molfile-saving-skip-date", true)

var readCdxAndPrintInfo = function (fname){
	var data = fs.readFileSync(fname);
	for (var m of indigo.iterateCDX(indigo.loadBuffer(data)))
	{
		console.log("*****");
		console.log("Smiles:");
		console.log(m.smiles());
		console.log("Molfile:");
		console.log(m.molfile());
//		console.log("Rawdata:");
//		console.log(m.rawData());
		console.log("Properties:");
		for (var prop of m.iterateProperties())
			console.log(prop.name() +' : ' + prop.rawData());
	}
}

console.log("**** Read CDX from file ****");
readCdxAndPrintInfo(local('../indigo-node/molecules/test-multi.cdx'));

readCdxAndPrintInfo(local('../indigo-node/molecules/CDX3_4molecules_prop.cdx'));


console.log("**** Read CDX with wrong empty objects ****");
readCdxAndPrintInfo(local('../indigo-node/molecules/test_title_0.cdx'));
readCdxAndPrintInfo(local('../indigo-node/molecules/test_title_1.cdx'));
readCdxAndPrintInfo(local('../indigo-node/molecules/test_title_2.cdx'));
readCdxAndPrintInfo(local('../indigo-node/molecules/test_title_3.cdx'));
readCdxAndPrintInfo(local('../indigo-node/molecules/test_title_4.cdx'));
readCdxAndPrintInfo(local('../indigo-node/molecules/test_title_5.cdx'));
readCdxAndPrintInfo(local('../indigo-node/molecules/test_title_6.cdx'));

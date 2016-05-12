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

var testMultipleSave = function (smifile, iterfunc, issmi){
	console.log("TESTING " + path.parse(smifile).name);
	var sdfout = indigo.writeFile(local("structures.sdf"));
	var cmlout = indigo.writeFile(local("structures.cml"));
	var rdfout = indigo.writeFile(local("structures.rdf"));
	var smiout = indigo.writeFile(local("structures.smi"));
	rdfout.rdfHeader();
	cmlout.cmlHeader();
	for (var item of iterfunc(smifile)) {
		var exc = false;
		try {
			item.countAtoms();
			item.smiles();
		}
		catch (e) {
			console.log(item.index() + e.message);
			if (issmi)
				console.log(item.rawData());
			exc = true;
		}
		if (!exc) {
			// item.clearCisTrans();
			for (var bond of item.iterateBonds()) {
				if ((bond.topology() == Indigo.RING) && (bond.bondOrder() == 2)) {
					bond.resetStereo();
				}
			}
			try {
				item.markEitherCisTrans();
			}
			catch (e) {
				console.log(item.index() + ' (while markEitherCisTrans) : ' + e.message);
				if (issmi)
					console.log(item.rawData());
				continue;
			}
			if (issmi) {
				item.setName('structure-' + item.index() + ' ' + item.rawData());
			} else {
				item.setName('structure-' + item.index());
			}
			item.setProperty("NUMBER", item.index().toString());
			cmlout.cmlAppend(item);
			smiout.smilesAppend(item);
			item.layout();
			indigo.setOption("molfile-saving-mode", "2000");
			sdfout.sdfAppend(item);
			indigo.setOption("molfile-saving-mode", "3000");
			rdfout.rdfAppend(item);
		}
	}
	cmlout.cmlFooter();
	sdfout.close();
	cmlout.close();
	rdfout.close();
	smiout.close();
	
	var cmliter = indigo.iterateCMLFile(local("structures.cml"));
	var sdfiter = indigo.iterateSDFile(local("structures.sdf"));
	var rdfiter = indigo.iterateRDFile(local("structures.rdf"));
	var smiiter = indigo.iterateSmilesFile(local("structures.smi"));
	var idx = 1;
	while (sdfiter) {
		cml = cmliter.next().value;
		sdf = sdfiter.next().value;
		rdf = rdfiter.next().value;
		smi = smiiter.next().value;
		
		console.log(sdf.index() + ' ' + sdf.name());
		sdf.resetSymmetricCisTrans();
		rdf.resetSymmetricCisTrans();
		try {
			var cs1 = sdf.canonicalSmiles();
			var cs2 = rdf.canonicalSmiles();
			var cs3 = smi.canonicalSmiles();
			var cs4 = cml.canonicalSmiles();
		}
		catch (e) {
			console.log(e.message);
			continue;
		}
		console.log(cs1);
		console.log(cs2);
		console.log(cs3);
		console.log(cs4);
		if (cs2 != cs1)
			console.log("MISMATCH");
		if (cs3 != cs1)
			console.log("MISMATCH");
		if (cs4 != cs1)
			console.log("MISMATCH");
		idx += 1;
	}
}

testMultipleSave(local("../indigo-node/molecules/helma.smi"), indigo.iterateSmilesFile.bind(indigo), true);
testMultipleSave(local("../indigo-node/molecules/chemical-structures.smi"), indigo.iterateSmilesFile.bind(indigo), true);
testMultipleSave(local("../indigo-node/molecules/pubchem_7m_err.sdf"), indigo.iterateSDFile.bind(indigo), false);
testMultipleSave(local("../indigo-node/molecules/acd2d_err.sdf"), indigo.iterateSDFile.bind(indigo), false);

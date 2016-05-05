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
var IndigoRenderer = require("../indigo-node/indigo_renderer");
var indigo_renderer = new IndigoRenderer(indigo);

var testDearom = function ()
{
	indigo.setOption("render-output-format", "png");
	indigo.setOption("render-background-color", "255,255,255");
	indigo.setOption("render-atom-ids-visible", "1");

	m = indigo.loadMolecule("c1ccsc1");
	cnt0 = indigo.countReferences();
	buf = indigo_renderer.renderToBuffer(m);
	cnt1 = indigo.countReferences();

	var status = indigo_renderer.renderToFile(m, "m.png");
	if (status == 1) console.log("m.png have been created");
	m.dearomatize();
	console.log(m.smiles());
}
var cdxml = function () {
	var status = indigo_renderer.renderReset();
	if (status == 1) console.log("renderer have been reseted");
	indigo.setOption("render-output-format", "png");
	indigo.setOption("render-background-color", "255,255,255");
	indigo.setOption("render-atom-ids-visible", "1");
	arr = indigo.createArray();
	var idx = 0;
	for (var m of indigo.iterateSmilesFile(local("../indigo-node/molecules/pubchem_slice_10.smi"))) {
		console.log(m.smiles());
		// Set title
		m.setProperty("title", "Molecule:" + idx + "\nMass: " + m.molecularWeight() + "\nFormula: " + m.grossFormula());
		//Add to the array
		arr.arrayAdd(m);
		idx++;
	}
	// Set required options    
	indigo.setOption("render-grid-title-property", "title");
	indigo.setOption("render-comment", "Comment:\nSet of molecules");
	// Render
	options_align = ["left", "right", "center", "center-left", "center-right"];
	for (var alignment of options_align) {
		indigo.setOption("render-grid-title-alignment", alignment);
		indigo_renderer.renderGridToFile(arr, null, 3, local("cdxml-test-"+alignment+".cdxml"));
	}
	options_length = [0, 10, 50, 100, 200];
	for (var length of options_length) {
		indigo.setOption("render-bond-length", length);
		indigo_renderer.renderGridToFile(arr, null, 3, local("cdxml-test-len"+length+".cdxml"));
	}
	indigo.setOption("render-output-format", "cdxml")
	buf = indigo_renderer.renderGridToBuffer(arr, null, 3)
	console.log(buf.length > 100);
}

cdxml();
testDearom();

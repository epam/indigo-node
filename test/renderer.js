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
var tmp = require('tmp');

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var local = path.join.bind(path, __dirname);

var Indigo = require("../indigo").Indigo;
var IndigoRenderer = require("../indigo_renderer");

var indigo = new Indigo();
var indigo_renderer = new IndigoRenderer(indigo);

var tmpDir = tmp.dirSync({ unsafeCleanup: true });

test('Dearomotize', function (t) {
    // console.log('\n#### - Renderer test - ####\n');
	t.plan(2);
    indigo.setOption("render-output-format", "png");
    indigo.setOption("render-background-color", "255,255,255");
    indigo.setOption("render-atom-ids-visible", "1");

    var m = indigo.loadMolecule("c1ccsc1");
    indigo.countReferences();
    indigo_renderer.renderToBuffer(m);
    indigo.countReferences();

	var status = indigo_renderer.renderToFile(m, path.join(tmpDir.name, "m.png"));

    t.ok(status, 'm.png must be created');
    m.dearomatize();
    t.equal(m.smiles(), 'C1=CSC=C1');
});

test('cdxml', function (t) {
	t.plan(2);
    var status = indigo_renderer.renderReset();
    t.ok(status, 'renderer must been reseted');
    indigo.setOption("render-output-format", "png");
    indigo.setOption("render-background-color", "255,255,255");
    indigo.setOption("render-atom-ids-visible", "1");
    var arr = indigo.createArray();
    var idx = 0;
    for (var m of indigo.iterateSmilesFile(local("fixtures/pubchem_slice_10.smi"))) {
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
    var options_align = ["left", "right", "center", "center-left", "center-right"];
    for (var alignment of options_align) {
        indigo.setOption("render-grid-title-alignment", alignment);
        indigo_renderer.renderGridToFile(arr, null, 3, tmpDir.name + "/cdxml-test-"+alignment+".cdxml");
    }
    var options_length = [0, 10, 50, 100, 200];
    for (var length of options_length) {
        indigo.setOption("render-bond-length", length);
        indigo_renderer.renderGridToFile(arr, null, 3, tmpDir.name + "/cdxml-test-len"+length+".cdxml");
    }
	indigo.setOption("render-output-format", "cdxml");
	var buf = indigo_renderer.renderGridToBuffer(arr, null, 3);
    t.ok(buf.length > 100);
});

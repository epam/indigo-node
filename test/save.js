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
var tmp = require('tmp');

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var local = path.join.bind(path, __dirname);

var Indigo = require("../indigo").Indigo;
var indigo = new Indigo();

var tmpDir = tmp.dirSync({ template: local('/tmp-XXXXXX'), unsafeCleanup: true });

var testMultipleSave = function (/*test*/ t, smifile, iterfunc, issmi){
	console.log("TESTING " + path.parse(smifile).name);
	var sdfout = indigo.writeFile(tmpDir.name + ("/structures.sdf"));
	var cmlout = indigo.writeFile(tmpDir.name + ("/structures.cml"));
	var rdfout = indigo.writeFile(tmpDir.name + ("/structures.rdf"));
	var smiout = indigo.writeFile(tmpDir.name + ("/structures.smi"));
	rdfout.rdfHeader();
	cmlout.cmlHeader();
	t.doesNotThrow(() => {
        for (var item of iterfunc(smifile)) {
            var exc = false;
            try {
                item.countAtoms();
                item.smiles();
            } catch (e) {
                if (issmi)
                    throw new Error(item.rawData());
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
                } catch (e) {
                    console.log(item.index() + ' (while markEitherCisTrans) : ' + e.message);
                    if (issmi)
                        throw new Error(item.rawData());
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
	}, null, 'check right file');
    sdfout.close();
    cmlout.close();
    rdfout.close();
    smiout.close();

	var cmliter = indigo.iterateCMLFile(local("structures.cml"));
	var sdfiter = indigo.iterateSDFile(local("structures.sdf"));
	var rdfiter = indigo.iterateRDFile(local("structures.rdf"));
	var smiiter = indigo.iterateSmilesFile(local("structures.smi"));
	var idx = 1;
	var sdf;
    t.doesNotThrow(() => {
        while (sdf = sdfiter.next().value) {
            var cml = cmliter.next().value;
            var rdf = rdfiter.next().value;
            var smi = smiiter.next().value;

            sdf.resetSymmetricCisTrans();
            rdf.resetSymmetricCisTrans();
            try {
                var cs1 = sdf.canonicalSmiles();
                var cs2 = rdf.canonicalSmiles();
                var cs3 = smi.canonicalSmiles();
                var cs4 = cml.canonicalSmiles();
                if (cs2 != cs1 || cs3 != cs1 || cs4 != cs1)
                    console.log("MISMATCH");
            }
            catch (e) {
                console.log(e.message);
                continue;
            }
            idx += 1;
        }
    }, null, 'check iterate');
};

test('\n#### - SAVE test - ####\n', function (t) {
	t.plan(4);
    testMultipleSave(t, local("fixtures/helma.smi"), indigo.iterateSmilesFile.bind(indigo), true);
    testMultipleSave(t, local("fixtures/chemical-structures.smi"), indigo.iterateSmilesFile.bind(indigo), true);
    testMultipleSave(t, local("fixtures/pubchem_7m_err.sdf"), indigo.iterateSDFile.bind(indigo), false);
    testMultipleSave(t, local("fixtures/acd2d_err.sdf"), indigo.iterateSDFile.bind(indigo), false);

    tmpDir.removeCallback();
});

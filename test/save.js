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
let tmp = require('tmp');

let assert = require('assert');
let path = require('path');
let fs = require('fs');
let local = path.join.bind(path, __dirname);

let Indigo = require("../indigo").Indigo;
let indigo = new Indigo();

let tmpDir = tmp.dirSync({ template: local('/tmp-XXXXXX'), unsafeCleanup: true });

let testMultipleSave = function (/*test*/ t, smifile, iterfunc, issmi){
	console.log("TESTING " + path.parse(smifile).name);
	let sdfout = indigo.writeFile(tmpDir.name + ("/structures.sdf"));
	let cmlout = indigo.writeFile(tmpDir.name + ("/structures.cml"));
	let rdfout = indigo.writeFile(tmpDir.name + ("/structures.rdf"));
	let smiout = indigo.writeFile(tmpDir.name + ("/structures.smi"));
	rdfout.rdfHeader();
	cmlout.cmlHeader();
	t.doesNotThrow(() => {
        for (let item of iterfunc(smifile)) {
            let exc = false;
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
                for (let bond of item.iterateBonds()) {
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

	let cmliter = indigo.iterateCMLFile(local("structures.cml"));
	let sdfiter = indigo.iterateSDFile(local("structures.sdf"));
	let rdfiter = indigo.iterateRDFile(local("structures.rdf"));
	let smiiter = indigo.iterateSmilesFile(local("structures.smi"));
	let idx = 1;
	let sdf;
    t.doesNotThrow(() => {
        while (sdf = sdfiter.next().value) {
            let cml = cmliter.next().value;
            let rdf = rdfiter.next().value;
            let smi = smiiter.next().value;

            sdf.resetSymmetricCisTrans();
            rdf.resetSymmetricCisTrans();
            try {
                let cs1 = sdf.canonicalSmiles();
                let cs2 = rdf.canonicalSmiles();
                let cs3 = smi.canonicalSmiles();
                let cs4 = cml.canonicalSmiles();
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


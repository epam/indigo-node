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
let IndigoRenderer = require("../indigo_renderer");

let indigo = new Indigo();
let renderer = new IndigoRenderer(indigo);
let tmpDir = tmp.dirSync({ template: local('/tmp-XXXXXX'), unsafeCleanup: true });

test('Align Atoms', function (t) {
    console.log('\n#### - Align Atoms - ####\n');
    t.plan(3);
    let query = indigo.loadSmarts("[#7]1~[#6]~[#6]~[#7]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]~1~2");
    let sdfout;
    t.doesNotThrow(() => sdfout = indigo.writeFile(tmpDir + "/aligned.sdf"), Object);

    let xyz = [];
    let collection = indigo.createArray();
    let refatoms = [];

    t.doesNotThrow(() => {
        for (let structure of indigo.iterateSDFile(local("fixtures/benzodiazepine.sdf.gz"))) {
            let match = indigo.substructureMatcher(structure).match(query);
            if (!match) {
                console.log("structure not matched, this is unexpected");
                return;
            }
            if (!structure.index()) {
                for (let atom of query.iterateAtoms()) {
                    xyz =xyz.concat(match.mapAtom(atom).xyz());
                }
            } else {
                let atoms = [];
                for (let atom of query.iterateAtoms()) {
                    atoms.push(match.mapAtom(atom).index());
                }
                let x = structure.alignAtoms(atoms, xyz);
                console.log('%d', x);
            }
            structure.foldHydrogens();
            sdfout.sdfAppend(structure);
            structure.setProperty("title", "Molecule:" + structure.index() + "\nMass: " + structure.molecularWeight() + "\nFormula: " + structure.grossFormula());
            refatoms.push(match.mapAtom(query.getAtom(0)).index());
            collection.arrayAdd(structure);
            if (structure.index() == 15) break;
        }
    }, undefined);

    indigo.setOption("render-highlight-thickness-enabled", "true");
    indigo.setOption("render-image-size", "400, 400");
    indigo.setOption("render-grid-title-property", "PUBCHEM_COMPOUND_CID");
    indigo.setOption("render-grid-title-font-size", "10");
    indigo.setOption("render-grid-title-offset", "2");
    indigo.setOption("render-grid-title-alignment", "0.5");
    indigo.setOption("render-coloring", "true");

    t.doesNotThrow(() => {
        indigo.setOption("render-output-format", "svg");
        renderer.renderGridToFile(collection, null, 4, tmpDir.name + "/grid.svg");
        //	console.log(checkImageSimilarity('grid.svg'));
        indigo.setOption("render-output-format", "png");
        renderer.renderGridToFile(collection, null, 4, tmpDir.name + "/grid.png");
        //	console.log(checkImageSimilarity('grid.png'));
        indigo.setOption("render-output-format", "svg");
        renderer.renderGridToFile(collection, refatoms, 4, tmpDir.name + "/grid1.svg");
        //	console.log(checkImageSimilarity('grid1.svg'));
        indigo.setOption("render-output-format", "png");
        renderer.renderGridToFile(collection, refatoms, 4, tmpDir.name + "/grid1.png");
        //	console.log(checkImageSimilarity('grid1.png'));
    }, undefined, 'check render-output format')


    indigo.setOption("render-grid-title-property", "title");
    indigo.setOption("render-image-size", "-1, -1");
    indigo.setOption("render-bond-length", "30");
    indigo.setOption("render-output-format", "png");

    t.doesNotThrow(() => {
        let options_align = ["left", "right", "center", "center-left", "center-right"];
        for (let alignment of options_align) {
            indigo.setOption("render-grid-title-alignment", alignment);
            let fname = "grid-" + alignment + ".png";
            renderer.renderGridToFile(collection, null, 4, tmpDir.name + "/" + fname);
        }
    }, undefined, 'check render-grid');
});

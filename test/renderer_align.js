/****************************************************************************
 * Copyright (C) from 2015 to Present EPAM Systems.
 *
 * This file is part of Indigo-Node binding.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/

/* declaration of modules  */
import { test } from 'tap';
import { dirSync } from 'tmp';

import path, { join } from 'path';
let local = join.bind(path, __dirname);

import { Indigo } from '../indigo';
import IndigoRenderer from '../indigo_renderer';

let indigo = new Indigo();
let renderer = new IndigoRenderer(indigo);
let tmpDir = dirSync({
    unsafeCleanup: true
});

test('Align Atoms', function(t) {
    // console.log('\n#### - Align Atoms - ####\n');
    t.plan(4);
    const query = indigo.loadSmarts('[#7]1~[#6]~[#6]~[#7]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]~1~2');
    let sdfout;
    t.doesNotThrow(() => sdfout = indigo.writeFile(tmpDir.name + '/aligned.sdf'), Object);

    let xyz = [];
    let collection = indigo.createArray();
    let refatoms = [];

    t.doesNotThrow(() => {
        for (let structure of indigo.iterateSDFile(local('fixtures/benzodiazepine.sdf.gz'))) {
            let match = indigo.substructureMatcher(structure).match(query);
            if (!match) {
                throw new Error('structure not matched, this is unexpected');
            }
            if (!structure.index()) {
                for (const atom of query.iterateAtoms()) {
                    xyz = xyz.concat(match.mapAtom(atom).xyz());
                }
            } else {
                let atoms = [];
                for (const atom of query.iterateAtoms()) {
                    atoms.push(match.mapAtom(atom).index());
                }
                structure.alignAtoms(atoms, xyz);                
            }
            structure.foldHydrogens();
            sdfout.sdfAppend(structure);
            structure.setProperty('title', 'Molecule: ' + structure.index() + '\nMass: ' + structure.molecularWeight() + 
                                  '\nFormula: ' + structure.grossFormula());
            refatoms.push(match.mapAtom(query.getAtom(0)).index());
            collection.arrayAdd(structure);
            if (structure.index() == 15) break;
        }
    }, undefined);

    indigo.setOption('render-highlight-thickness-enabled', 'true');
    indigo.setOption('render-image-size', '400, 400');
    indigo.setOption('render-grid-title-property', 'PUBCHEM_COMPOUND_CID');
    indigo.setOption('render-grid-title-font-size', '10');
    indigo.setOption('render-grid-title-offset', '2');
    indigo.setOption('render-grid-title-alignment', '0.5');
    indigo.setOption('render-coloring', 'true');

    t.doesNotThrow(() => {
        indigo.setOption('render-output-format', 'svg');
        renderer.renderGridToFile(collection, null, 4, tmpDir.name + '/grid.svg');
        indigo.setOption('render-output-format', 'png');
        renderer.renderGridToFile(collection, null, 4, tmpDir.name + '/grid.png');
        indigo.setOption('render-output-format', 'svg');
        renderer.renderGridToFile(collection, refatoms, 4, tmpDir.name + '/grid1.svg');
        indigo.setOption('render-output-format', 'png');
        renderer.renderGridToFile(collection, refatoms, 4, tmpDir.name + '/grid1.png');
    }, 'check render-output format');


    indigo.setOption('render-grid-title-property', 'title');
    indigo.setOption('render-image-size', '-1, -1');
    indigo.setOption('render-bond-length', '30');
    indigo.setOption('render-output-format', 'png');

    t.doesNotThrow(() => {
        let options_align = ['left', 'right', 'center', 'center-left', 'center-right'];
        for (let alignment of options_align) {
            indigo.setOption('render-grid-title-alignment', alignment);
            let fname = 'grid-' + alignment + '.png';
            renderer.renderGridToFile(collection, null, 4, tmpDir.name + '/' + fname);
        }
    }, 'check render-grid');
});
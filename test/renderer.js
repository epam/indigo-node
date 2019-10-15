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
let indigo_renderer = new IndigoRenderer(indigo);

let tmpDir = dirSync({
    unsafeCleanup: true
});

test('Dearomotize', function(t) {
    // console.log('\n#### - Renderer test - ####\n');
    t.plan(2);
    indigo.setOption('render-output-format', 'png');
    indigo.setOption('render-background-color', '255,255,255');
    indigo.setOption('render-atom-ids-visible', '1');

    let m = indigo.loadMolecule('c1ccsc1');
    indigo.countReferences();
    indigo_renderer.renderToBuffer(m);
    indigo.countReferences();

    let status = indigo_renderer.renderToFile(m, join(tmpDir.name, 'm.png'));

    t.ok(status, 'm.png must be created');
    m.dearomatize();
    t.equal(m.smiles(), 'C1=CSC=C1');
});

test('cdxml', function(t) {
    t.plan(2);
    let status = indigo_renderer.renderReset();
    t.ok(status, 'renderer must been reseted');
    indigo.setOption('render-output-format', 'png');
    indigo.setOption('render-background-color', '255,255,255');
    indigo.setOption('render-atom-ids-visible', '1');
    let arr = indigo.createArray();
    let idx = 0;
    for (let m of indigo.iterateSmilesFile(local('fixtures/pubchem_slice_10.smi'))) {
        // Set title
        m.setProperty('title', 'Molecule:' + idx + '\nMass: ' + m.molecularWeight() + '\nFormula: ' + m.grossFormula());
        // Add to the array
        arr.arrayAdd(m);
        idx++;
    }
    // Set required options
    indigo.setOption('render-grid-title-property', 'title');
    indigo.setOption('render-comment', 'Comment:\nSet of molecules');
    // Render
    let options_align = ['left', 'right', 'center', 'center-left', 'center-right'];
    for (let alignment of options_align) {
        indigo.setOption('render-grid-title-alignment', alignment);
        indigo_renderer.renderGridToFile(arr, null, 3, tmpDir.name + '/cdxml-test-' + alignment + '.cdxml');
    }
    let options_length = [0, 10, 50, 100, 200];
    for (let length of options_length) {
        indigo.setOption('render-bond-length', length);
        indigo_renderer.renderGridToFile(arr, null, 3, tmpDir.name + '/cdxml-test-len' + length + '.cdxml');
    }
    indigo.setOption('render-output-format', 'cdxml');
    let buf = indigo_renderer.renderGridToBuffer(arr, null, 3);
    t.ok(buf.length > 100);
});
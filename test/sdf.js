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
let indigo = new Indigo();

let tmpDir = dirSync({
    unsafeCleanup: true
});

let readSdfAndPrintInfo = function(fname) {
    for (let m of indigo.iterateSDFile(local(fname))) {
        m.smiles();
        m.molfile();
        m.rawData();
        for (let prop of m.iterateProperties())
            prop.rawData();
    }
};

test('Read SDF.GZ', function(t) {
    // console.log('\n#### - CDF test - ####\n');
    t.plan(1);
    t.throws(() => readSdfAndPrintInfo('fixtures/sugars.sdf.gz'), null);
});

let names = [];
for (let i = 0; i < 10; i++) {
    names.push(i.toString());
    names.push('Name' + i);
    names.push('Much longer name' + i);
}

let checkMolNames = function( /* test*/ t, sdf_file_name) {
    let i = 0;
    for (let m of indigo.iterateSDFile(sdf_file_name)) {
        t.equals(m.name(), names[i], 'Names should be the same');
        i++;
    }
};

test('Save and load molecule names from SDF', function(t) {
    t.plan(30);

    let sdf_file_name = tmpDir.name + '/sdf-names.sdf';
    let saver = indigo.createFileSaver(sdf_file_name, 'sdf');

    for (let name of names) {
        let m = indigo.createMolecule();
        m.setName(name);
        saver.append(m);
    }
    saver.close();
    checkMolNames(t, sdf_file_name);
});

test('Use sdfAppend', function(t) {
    t.plan(30);

    let sdf_file_name = tmpDir.name + '/sdf-names-2.sdf';
    let sdf = indigo.writeFile(sdf_file_name);

    for (let name of names) {
        let m = indigo.createMolecule();
        m.setName(name);
        sdf.sdfAppend(m);
    }
    sdf.close();
    checkMolNames(t, sdf_file_name);
});

test('Read SDF with invalid header', function(t) {
    t.plan(1);
    t.equals(readSdfAndPrintInfo('fixtures/bad-header.sdf'), undefined, 'should be undefined');
});
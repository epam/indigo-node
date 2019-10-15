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

import path, { join } from 'path';
import { readFileSync } from 'fs';
let local = join.bind(path, __dirname);

import { Indigo } from '../indigo';
let indigo = new Indigo();

let testEnumTautomersForMolecule = function(t, molecule) {
    try {
        let iter = indigo.iterateTautomers(molecule, 'INCHI');
        let lst = [];
        for (let mol of iter) {
            let prod = mol.clone();
            lst.push(prod.canonicalSmiles());
        }
        lst.sort();
    } catch (e) {
        t.equal(e.message, "inchi-wrapper: Indigo-InChI: InChI generation failed: Accepted unusual valence(s): N(4); Cannot process aromatic bonds. Code: 2.");
    }
};

let testEnumTautomersForSDF = function(t, sdf_file) {
    let data = readFileSync(sdf_file);
    for (let molecule of indigo.iterateSDF(indigo.loadBuffer(data))) {
        molecule.dearomatize();
        testEnumTautomersForMolecule(t, molecule);
        molecule.aromatize();
        testEnumTautomersForMolecule(t, molecule);
    }
};

test('This is the case when not all tautomers are found for the first time and the algorithm requires the second attempt:', function(t) {
    // console.log('\n#### - TAU_EN test - ####\n');
    t.plan(1);
    t.doesNotThrow(() => testEnumTautomersForMolecule(t, indigo.loadMolecule('OC1N=C2C(=NC(N)=NC(=O)2)NC(O)=1')), Array);
});

test('Test tautomers1-small.sdf:', function(t) {
    t.plan(1);
    t.doesNotThrow(() => testEnumTautomersForSDF(t, local('fixtures/tautomers1-small.sdf')), Array);
});

test('Test tautomers2-small.sdf:', function(t) {
    t.plan(1);
    t.doesNotThrow(() => testEnumTautomersForSDF(t, local('fixtures/tautomers2-small.sdf')), Array);
});

test('Test tautomers1-large.sdf:', function(t) {
    t.plan(13);
    t.doesNotThrow(() => testEnumTautomersForSDF(t, local('fixtures/tautomers1-large.sdf')), Array);
});

test('Test tautomers2-large.sdf:', function(t) {
    t.plan(1);
    t.doesNotThrow(() => testEnumTautomersForSDF(t, local('fixtures/tautomers2-large.sdf')), Array);
});
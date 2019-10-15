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
let test = require('tap').test;

let path = require('path');
let fs = require('fs');
let local = path.join.bind(path, __dirname);

let Indigo = require('../indigo').Indigo;
let indigo = new Indigo();

test('SDF load string and buffer', function(t) {
    t.plan(3);
    let data = fs.readFileSync(local('fixtures/stereo_parity.sdf'));
    t.doesNotThrow(() => data.toString(), String, 'should be string');

    let str1 = '';
    let str2 = '';
    t.doesNotThrow(() => {
        // *** SDF loadString ***
        for (const m of indigo.iterateSDF(indigo.loadString(data.toString()))) {
            str1 += m.smiles();
        }
        // *** SDF loadBuffer ***
        for (const m of indigo.iterateSDF(indigo.loadBuffer(data))) {
            str2 += m.smiles();
        }
    });
    t.equals(str1, str2, 'loadString and loadBuffer should be equal');
});

test('SMILES load string and buffer', function(t) {
    t.plan(3);
    let data = fs.readFileSync(local('fixtures/helma.smi'));
    t.doesNotThrow(() => data.toString(), String, 'should be string');

    let str1 = '';
    let str2 = '';
    t.doesNotThrow(() => {
        // *** SMILES loadString ***
        for (const m of indigo.iterateSmiles(indigo.loadString(data.toString()))) {
            str1 += m.smiles();
        }
        // *** SMILES loadBuffer ***
        for (const m of indigo.iterateSmiles(indigo.loadBuffer(data))) {
            str2 += m.smiles();
        }
    });
    t.equals(str1, str2, 'loadString and loadBuffer should be equal');
});

test('CML load string and buffer', function(t) {
    t.plan(3);
    let data = fs.readFileSync(local('fixtures/tetrahedral-all.cml'));
    t.doesNotThrow(() => data.toString(), String, 'should be string');
    indigo.setOption('ignore-stereochemistry-errors', 'true');
    let str1 = '';
    let str2 = '';
    t.doesNotThrow(() => {
        // *** CML loadString ***
        for (const m of indigo.iterateCML(indigo.loadString(data.toString()))) {
            str1 += m.smiles() + ' ';
        }
        // *** CML loadBuffer ***
        for (const m of indigo.iterateCML(indigo.loadBuffer(data))) {
            str2 += m.smiles() + ' ';
        }
    });
    t.equals(str1, str2, 'loadString and loadBuffer should be equal');
});

test('RDF load string and buffer', function(t) {
    t.plan(3);
    let data = fs.readFileSync(local('fixtures/reactions.rdf'));
    t.doesNotThrow(() => data.toString(), String, 'should be string');

    let str1 = '';
    let str2 = '';
    t.doesNotThrow(() => {
        // *** RDF loadString ***
        for (const m of indigo.iterateRDF(indigo.loadString(data.toString()))) {
            str1 += m.smiles();
        }
        // *** RDF loadBuffer ***
        for (const m of indigo.iterateRDF(indigo.loadBuffer(data))) {
            str2 += m.smiles();
        }
    });
    t.equals(str1, str2, 'loadString and loadBuffer should be equal');
});
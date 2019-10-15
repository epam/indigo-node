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

indigo.setOption('molfile-saving-skip-date', true);

let readCdxAndPrintInfo = function(fname) {
    let data = readFileSync(fname);
    let str = [];
    for (let m of indigo.iterateCDX(indigo.loadBuffer(data))) {
        str += '*****';
        str += 'Smiles:';
        str += m.smiles();
        str += 'Molfile:';
        str += m.molfile();
        str += 'Properties:';
        for (let prop of m.iterateProperties())
            str += prop.name() + ' : ' + prop.rawData();
    }
    return str;
};

test('Read CDX from file', function(t) {
    // console.log('\n#### - CDX test - ####\n');
    t.plan(2);
    t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test-multi.cdx')), String);
    t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/CDX3_4molecules_prop.cdx')), String);
});

test('Read CDX with wrong empty objects', function(t) {
    t.plan(7);
    t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test_title_0.cdx')), String);
    t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test_title_1.cdx')), String);
    t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test_title_2.cdx')), String);
    t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test_title_3.cdx')), String);
    t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test_title_4.cdx')), String);
    t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test_title_5.cdx')), String);
    t.doesNotThrow(() => readCdxAndPrintInfo(local('fixtures/test_title_6.cdx')), String);
});
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
let local = join.bind(path, __dirname);

import { Indigo } from '../indigo';
let indigo = new Indigo();

indigo.setOption('treat-x-as-pseudoatom', true);
indigo.setOption('ignore-stereochemistry-errors', true);

test('testRsite', function(t) {
    // console.log('\n#### - Rgroup test - ####\n');
    t.plan(1);
    let query = indigo.loadQueryMolecule('[OH]C1C([OH])C([*:1])OC([*:2])C1[OH]');
    for (let rsite of query.iterateRSites()) {
        rsite.removeConstraints('rsite');
        rsite.addConstraint('atomic-number', '12');
    }
    t.equal(query.smiles(), '[OH]C1C([OH])C([Mg])OC([Mg])C1[OH]');
});

test('testRGroupDecomposition', function(t) {
    t.plan(1);
    t.doesNotThrow(() => {
        let query = indigo.loadQueryMolecule('[OH]C1C([OH])C([*:1])OC([*:2])C1[OH]');
        for (let rsite of query.iterateRSites()) {
            rsite.removeConstraints('rsite');
            rsite.addConstraintNot('atomic-number', '1');
        }
        for (let structure of indigo.iterateSDFile(local('fixtures/sugars.sdf.gz'))) {
            structure.getProperty('molregno');
            let match = indigo.substructureMatcher(structure).match(query);
            if (!match)
                continue;

            let to_remove = [];
            let mapped_rsites = [];
            for (let qatom of query.iterateAtoms()) {
                let tatom = match.mapAtom(qatom);
                if (qatom.atomicNumber() == 0) {
                    tatom.setAttachmentPoint(1);
                    mapped_rsites.push(tatom);
                } else
                    to_remove.push(tatom.index());
            }
            structure.removeAtoms(to_remove);
            for (const tatom of mapped_rsites) {
                if (structure.component(tatom.componentIndex()).clone().smiles() == '')
                    throw Error('!');
            }
        }
    });
});
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

import { Indigo } from '../indigo';
import { Bingo } from '../bingo';

const indigo = new Indigo();

const smiles = ['CCCC1CCCCC1CPC', 'CCC1CCNCC1CPC'];
const ids = [];
// var entry = 10000;
const entry = 10;

const tmpDir = dirSync({
    unsafeCleanup: true
});

test('Create database', function(t) {
    // console.log('\n#### - Bingo database test - ####\n');

    t.plan(2);
    const bingo = Bingo.createDatabaseFile(indigo, tmpDir.name, 'molecule');
    t.ok(bingo.id >= 0, 'bd should be created');
    for (let i = 0; i < entry; i++) {
        for (let sm of smiles) {
            let id = bingo.insert(indigo.loadMolecule(sm));
            ids[id] = sm;
        }
    }
    t.doesNotThrow(() => bingo.optimize, 0, 'should be more or equal to zero');
    bingo.close();
});

test('Append to the database', function(t) {
    t.plan(2);
    const bingo = Bingo.loadDatabaseFile(indigo, tmpDir.name);
    t.ok(bingo.id >= 0, 'bd should be loaded');
    const smiles2 = ['C1CPCCC1', 'C1CONCC1'];
    let lastid = ids.length;
    for (let i = 0; i < entry; i++) {
        for (const sm of smiles2) {
            lastid += 2; // Skip space on purpose
            const id = bingo.insert(indigo.loadMolecule(sm), lastid);
            ids[id] = sm;
        }
    }
    t.equal(lastid, 60);
    bingo.close();
});

test('Validate and search', function(t) {
    t.plan(5);
    const bingo = Bingo.loadDatabaseFile(indigo, tmpDir.name, 'read_only:true');
    let objSmiles = [];
    let refSmiles = [];
    for (const id in ids) {
        const obj = bingo.getRecordById(id);
        const ref = indigo.loadMolecule(ids[id]);

        objSmiles.push(obj.canonicalSmiles());
        refSmiles.push(ref.canonicalSmiles());
    }
    t.deepEquals(objSmiles, refSmiles, 'should be identical smiles');

    const smiles2 = ['C1CPCCC1', 'C1CONCC1'];
    for (let sm of smiles.concat(smiles2)) {
        const q = indigo.loadQueryMolecule(sm);
        const search = bingo.searchSub(q);
        let found = [];
        while (search.next()) {
            const id = search.getCurrentId();
            found.push(id);
        }
        let should_find = [];
        for (const id in ids) {
            if (ids[id] == sm)
                should_find.push(id);
        }
        t.equals(found.toString(), should_find.toString());
    }
    bingo.close();

    tmpDir.removeCallback();
});
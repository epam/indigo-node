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

import { test } from 'tap';
import { dirSync } from 'tmp';

import { Indigo } from '../indigo';
import { Bingo } from '../bingo';
import { BingoException } from '../bingo';

let indigo = new Indigo();

let searchSub = function(bingo, q, options) {
    let resultIds = [];
    let result = bingo.searchSub(q, options);
    while (result.next())
        resultIds.push(result.getCurrentId());
    return resultIds;
};

let searchExact = function(bingo, q, options) {
    let result = bingo.searchExact(q, options);
    let resultIds = [];
    while (result.next())
        resultIds.push(result.getCurrentId());
    return resultIds;
};


let searchSim = function(bingo, q, minSim, maxSim, metric) {
    let result = bingo.searchSim(q, minSim, maxSim, metric);
    // console.log("Search sim: %d %d %d", result.estimateRemainingResultsCount(), result.estimateRemainingResultsCountError(), result.estimateRemainingTime());
    while (result.next()) {
        // console.log(result.getCurrentId(), result.getCurrentSimilarityValue());
        try {
            result.getIndigoObject();
        } catch (e) {
            // console.log("BingoException: %s", e.message);
        }
    }
    result.close();
};

let tmpDir = dirSync({
    unsafeCleanup: true
});

test('Creating temporary database', function(t) {
    // console.log('\n#### - Bingo-basic test - ####\n');

    t.plan(5);
    let bingo = Bingo.createDatabaseFile(indigo, tmpDir.name, 'molecule');
    t.ok(bingo.id >= 0, 'bd should be created');
    bingo.insert(indigo.loadMolecule('C1CCCCC1'));
    bingo.insert(indigo.loadMolecule('C1CCNCC1'));
    let insertedIndex = bingo.insert(indigo.loadMolecule('C1CCNCC1'), 100);
    t.equal(insertedIndex, 100, 'should be right id');
    bingo.optimize();
    let qm = indigo.loadQueryMolecule('C');
    t.deepEquals(searchSub(bingo, qm), [0, 1, 100]);
    bingo.delete(insertedIndex);
    t.deepEquals(searchSub(bingo, qm), [0, 1]);

    t.throws(() => bingo.delete(31459), BingoException, 'delete: should be exception, incorrect index');
    bingo.close();
});

test('Loading existing database', function(t) {
    t.plan(2);
    let loadBingo = Bingo.loadDatabaseFile(indigo, tmpDir.name);
    let m = indigo.loadMolecule('C1CCCCC1');
    searchSim(loadBingo, m, 0.9, 1, 'tanimoto');
    searchSim(loadBingo, m, 0.9, 1, 'tversky');
    searchSim(loadBingo, m, 0.9, 1, 'tversky 0.1 0.9');
    searchSim(loadBingo, m, 0.9, 1, 'tversky 0.9 0.1');
    searchSim(loadBingo, m, 0.9, 1, 'euclid-sub');

    t.throws(() => Bingo.loadDatabaseFile(indigo, 'idonotexist', 'molecule'), BingoException, 'should be exception, non-exist');
    loadBingo.close();

    t.throws(() => loadBingo.insert(m), BingoException, 'should be exception, closed BD');
});

test('Simple exact search', function(t) {
    t.plan(2);
    let bingo = Bingo.createDatabaseFile(indigo, tmpDir.name, 'molecule');
    let mol1 = indigo.loadMolecule('ICCCCOC(=O)C1=CC([N+]([O-])=O)=C([N+]([O-])=O)C=C1');
    let mol2 = indigo.loadMolecule('CCCC');
    bingo.insert(mol1);
    bingo.insert(mol2);
    t.deepEquals(searchExact(bingo, mol1), [0]);
    t.deepEquals(searchExact(bingo, mol2), [1]);

    bingo.close();
    tmpDir.removeCallback();
});
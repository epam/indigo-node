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

test('Test 1', function(t) {
    // console.log('\n#### - Com test - ####\n');
    t.plan(2);
    let rxn = indigo.createReaction();
    rxn.addProduct(indigo.loadMolecule('CCCC'));
    rxn.addReactant(indigo.loadMolecule('CCCC'));
    let reactingCenters = [];
    for (const m of rxn.iterateMolecules())
        for (const b of m.iterateBonds())
            reactingCenters.push(rxn.reactingCenter(b));
    t.deepEquals(reactingCenters, [0, 0, 0, 0, 0, 0], 'check reacting centers');
    for (const m of rxn.iterateMolecules())
        for (const b of m.iterateBonds())
            rxn.setReactingCenter(b, indigo.CENTER | indigo.UNCHANGED);
    let modifiedCenters = [];
    for (const m of rxn.iterateMolecules())
        for (const b of m.iterateBonds())
            modifiedCenters.push(rxn.reactingCenter(b));
    t.deepEquals(modifiedCenters, [3, 3, 3, 3, 3, 3], 'check modified centers');
});

test('Test AAM', function(t) {
    t.plan(1);
    let rxn2 = indigo.loadReaction('CC=O>>CCO');
    for (let m of rxn2.iterateMolecules())
        for (let b of m.iterateBonds())
            rxn2.setReactingCenter(b, indigo.UNCHANGED | indigo.ORDER_CHANGED);
    rxn2.automap('DISCARD');
    let correct = '[CH3:1][CH:2]=[O:3]>>[CH3:1][CH2:2][OH:3]';
    t.equals(rxn2.smiles(), correct, 'aam reaction smiles for given RC');
});

test('Test correct reacting centers', function(t) {
    t.plan(2);
    let rxn = indigo.loadReaction('[CH3:7][CH2:6][CH2:1][CH2:2]O[CH2:4][CH2:5][CH2:8][CH3:9]>>[CH3:7][CH2:6][CH:1]=[CH:2]C[CH2:4][CH2:5][C:8]#[CH:9]');
    let reactingCenters = [];
    for (const m of rxn.iterateMolecules())
        for (const b of m.iterateBonds())
            reactingCenters.push(rxn.reactingCenter(b));
    t.deepEquals(reactingCenters, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 'check reacting centers');
    rxn.correctReactingCenters();
    let modifiedCenters = [];
    for (const m of rxn.iterateMolecules())
        for (const b of m.iterateBonds())
            modifiedCenters.push(rxn.reactingCenter(b));
    t.deepEquals(modifiedCenters, [2, 2, 8, 4, 4, 2, 2, 8, 2, 2, 8, 4, 4, 2, 2, 8], 'check modified centers');
    rxn.rxnfile();
});

test('Test reaction making', function(t) {
    t.plan(2);
    let rxn = indigo.createReaction();
    let r1 = indigo.loadMoleculeFromFile(local('fixtures/reactant1.rxn'));
    let r2 = indigo.loadMoleculeFromFile(local('fixtures/reactant2.rxn'));
    let p1 = indigo.loadMoleculeFromFile(local('fixtures/product1.rxn'));

    rxn.addReactant(r1);
    rxn.addReactant(r2);
    rxn.addProduct(p1);

    rxn.layout();
    let tmpDir = dirSync({
        unsafeCleanup: true
    });
    rxn.saveRxnfile(join(tmpDir.name, 'result.rxn'));
    tmpDir.removeCallback();

    t.deepEquals([rxn.countReactants(), rxn.countProducts(), rxn.countMolecules()], [2, 1, 3]);
    const correct = [
        [105.98844242095947, 105.96428298950195, 105.96428298950195, 'O=C([O-])[O-].[Na+].[Na+]'],
        [506.5006489753723, 506.15768551826477, 506.15768551826477, 'C1C=C(C2(O)OC(=O)C(C3C=C4OCOC4=CC=3)=C2CC2C=C(OC)C(OC)=C(OC)C=2)C=CC=1OC'],
    ];
    let result = [];
    for (let item of rxn.iterateReactants()) {
        let ar = [];
        ar.push(item.molecularWeight());
        ar.push(item.mostAbundantMass());
        ar.push(item.monoisotopicMass());
        ar.push(item.smiles());
        result.push(ar);
    }
    t.deepEquals(result, correct);
});

test('Test MDLCT', function(t) {
    t.plan(1);
    let mol = indigo.loadMolecule('C(CC)CC');
    mol.layout();
    t.doesNotThrow(() => mol.mdlct(), Array);
});

let componentSmiles = function(mol) {
    if (mol.countComponents() > 1) {
        let items = [];
        for (let comp of mol.iterateComponents()) {
            let item = comp.clone().canonicalSmiles();
            let ext = item.search(' |');
            if (ext > 0) item = item.substring(0, ext);
            items.push(item);
        }
        return items.sort().join('.');
    }
    return mol.canonicalSmiles();
};

test('Test Canonical', function(t) {
    t.plan(1);
    for (const m of indigo.iterateSDFile(local('fixtures/test.sdf')))
        t.doesNotThrow(() => componentSmiles(m), String);
});
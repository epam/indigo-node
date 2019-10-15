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
const local = join.bind(path, __dirname);

import { Indigo } from '../indigo';
const indigo = new Indigo();

indigo.setOption('molfile-saving-skip-date', '1');

test('Query reload', function(t) {
    // console.log('\n#### - Indigo basic test - ####\n');

    t.plan(2);

    const q = indigo.loadQueryMoleculeFromFile(local('fixtures/q_atom_list.mol'));
    const qmf1 = q.molfile();
    const q2 = indigo.loadQueryMolecule(q.cml());
    const qmf2 = q2.molfile();
    t.equal(qmf1, qmf2, 'reloaded query should be equal');

    /* Check that queires are equivalent */
    const matcher = indigo.substructureMatcher(indigo.loadMolecule('[Sc]CN[He]'));
    const none1 = matcher.match(q);
    const none2 = matcher.match(q2);
    t.notOk(none1 || none2, 'matching results should be None');
});

test('Remove constraints and reload', function(t) {
    t.plan(2);

    const q = indigo.loadQueryMolecule('c1[nH]c2c(c(N)[n+]([O-])c[n]2)[n]1');
    const tmp = indigo.loadMolecule('c1[n]c2c(N)[n+]([O-])c[n]c2[n]1[C@H]1[C@@H](O)[C@H](O)[C@H](CO)O1');
    const matcher = indigo.substructureMatcher(tmp);

    const original_smiles = q.smiles();
    const has_match_orig = (matcher.match(q) != null);
    // console.log(q.smiles() + ' ' + has_match_orig);

    for (let atom of q.iterateAtoms())
        atom.removeConstraints('hydrogens');
    const has_match = (matcher.match(q) != null);
    // console.log(q.smiles() + ' ' + has_match);

    const q2 = q.clone();
    const has_match2 = (matcher.match(q2) != null);
    // console.log(q2.smiles() + ' ' + has_match2);
    t.equal(has_match, has_match2, 'query molecule match should be the same after cloning');

    /* reload query from original smiles */
    const q3 = indigo.loadQueryMolecule(original_smiles);
    const has_match3 = (matcher.match(q3) != null);
    // console.log(q3.smiles() + ' ' + has_match3);
    t.equal(has_match3, has_match_orig, 'query molecule match should be the same after reloading from SMILE');
});

test('Bad valence, smiles and unfold', function(t) {
    t.plan(2);
    const m1 = indigo.loadMolecule('C\\C=C(/N(O)=O)N(O)=O');

    const sm = m1.smiles();
    // console.log(m1.smiles());
    // console.log(m1.canonicalSmiles());
    let exceptionMessage = '';
    try {
        m1.unfoldHydrogens()
    } catch (e) {        
        exceptionMessage = e.message;
    }
    t.equal(exceptionMessage, "element: bad valence on N having 4 drawn bonds, charge 0, and 0 radical electrons");

    const sm2 = m1.smiles();
    t.equal(sm2, sm, 'should be equal');
});

test('Serialize and atom changing', function(t) {
    t.plan(2);
    const m = indigo.loadMolecule('CC[C@@H](N)\\C=C/C');
    // console.log(m.smiles());
    // console.log(m.canonicalSmiles());

    for (let a of m.iterateAtoms())
        a.resetAtom('*');
    t.ok(m.smiles(), 'atom changing');

    const m2 = indigo.unserialize(m.serialize());
    t.ok(m2.smiles(), 'serialize');
});

test('Anormal properties', function(t) {
    t.plan(1);
    let a = {};
    const m = indigo.loadMolecule('[WH7][W][W][W+10][W][W-10]');
    let strM = '';
    for (a of m.iterateAtoms())
        strM += ' ' + a.charge() + ' ' + a.valence() + '\n';

    let strM2 = '';
    const m2 = indigo.unserialize(m.serialize());
    for (a of m2.iterateAtoms())
        strM2 += ' ' + a.charge() + ' ' + a.valence() + '\n';
    t.equal(strM, strM2);
});

test('Unmarked stereobonds', function(t) {
    t.plan(1);
    const m = indigo.loadMoleculeFromFile(local('fixtures/stereo.mol'));
    m.clearStereocenters();
    const m2 = indigo.loadMolecule(m.molfile());

    t.equal(m.canonicalSmiles(), m2.canonicalSmiles(), 'canonical smiles should be equal');
});

test('Chemical formula', function(t) {
    t.plan(1);
    const correctFormulas = [
        'Br I',
        'Br H',
        'H2 O4 S',
        'C H3 I',
        'C2 H5 Br',
        'H2 O',
        'C6 H6',
        'C6 H5 He',
        'C6 H5 Br He'
    ];
    const ourFormulas = [
        indigo.loadMolecule('[Br][I]').grossFormula(),
        indigo.loadMolecule('[Br][H]').grossFormula(),
        indigo.loadMolecule('OS(=O)(=O)O').grossFormula(),
        indigo.loadMolecule('CI').grossFormula(),
        indigo.loadMolecule('CCBr').grossFormula(),
        indigo.loadMolecule('[H]O[H]').grossFormula(),
        indigo.loadMolecule('c1ccccc1').grossFormula(),
        indigo.loadMolecule('c1ccccc1[He]').grossFormula(),
        indigo.loadMolecule('c1ccccc1[He][Br]').grossFormula(),
    ];
    t.deepEqual(ourFormulas, correctFormulas);
});

test('Nei iterator', function(t) {
    t.plan(1);
    const m = indigo.loadMolecule('CCC1=CC2=C(C=C1)C(CC)=CC(CC)=C2');
    const correctNeiBonds = {
        0: ['1 0'],
        1: ['0 0', '2 1'],
        2: ['1 1', '3 2', '7 7'],
        3: ['2 2', '4 3'],
        4: ['3 3', '5 4', '15 16'],
        5: ['4 4', '6 5', '8 8'],
        6: ['5 5', '7 6'],
        7: ['6 6', '2 7'],
        8: ['5 8', '9 9', '11 11'],
        9: ['8 9', '10 10'],
        10: ['9 10'],
        11: ['8 11', '12 12'],
        12: ['11 12', '13 13', '15 15'],
        13: ['12 13', '14 14'],
        14: ['13 14'],
        15: ['12 15', '4 16'],
    };
    let neiBonds = {};
    for (let v of m.iterateAtoms()) {
        neiBonds[v.index()] = [];
        for (let nei of v.iterateNeighbors()) {
            neiBonds[v.index()].push(nei.index() + ' ' + nei.bond().index());
        }
    }
    t.deepEqual(neiBonds, correctNeiBonds);
});

test('Structure normalization', function(t) {
    t.plan(1);
    const m = indigo.loadMolecule('[H]N(C)C(\\[H])=C(\\[NH2+][O-])N(=O)=O');
    m.smiles();
    m.normalize('');
    const sm1 = m.smiles();
    m.normalize('');
    const sm2 = m.smiles();
    t.equal(sm1, sm2);
});

test('R-group big index', function(t) {
    t.plan(6);
    const mols = ['r31.mol', 'r32.mol', 'r128.mol'];
    for (let molfile of mols) {
        if (molfile == 'r128.mol') {
            t.throws(() => indigo.loadMoleculeFromFile(local('fixtures/' + molfile)), Object);
            t.throws(() => indigo.loadQueryMoleculeFromFile(local('fixtures/' + molfile)), Object);
        } else {
            t.doesNotThrow(() => indigo.loadMoleculeFromFile(local('fixtures/' + molfile)), Object);
            t.doesNotThrow(() => indigo.loadQueryMoleculeFromFile(local('fixtures/' + molfile)), Object);
        }
    }
});

test('Smiles with R-group', function(t) {
    t.plan(3);
    const smiles_set = ['NC[*][*][*][*]', '[*][*]NC[*][*]', '[*][*][*][*]NC'];
    const rightAtoms = {
        'NC[*][*][*][*]': '0 N;1 C;2 R;3 R;4 R;5 R;',
        '[*][*]NC[*][*]': '0 R;1 R;2 N;3 C;4 R;5 R;',
        '[*][*][*][*]NC': '0 R;1 R;2 R;3 R;4 N;5 C;',
    };
    for (let smiles of smiles_set) {
        const m = indigo.loadMolecule(smiles);
        let tmpAtoms = '';
        for (let a of m.iterateAtoms())
            tmpAtoms += a.index() + ' ' + a.symbol() + ';';
        t.equal(tmpAtoms, rightAtoms[smiles], smiles);
    }
});

test('Smiles <-> Molfile', function(t) {
    const m = indigo.loadQueryMolecule('[CH6]');
    t.plan(3);
    indigo.setOption("ignore-noncritical-query-features", "true");
    for (let val of ['2000', '3000', 'auto']) {
        indigo.setOption('molfile-saving-mode', val);
        const m2 = indigo.loadMolecule(m.molfile());
        const m3 = indigo.loadQueryMolecule(m.molfile());
        t.deepEqual(m2.smiles(), m3.smiles(), ' molfile-saving-mode: ' + val);
    }
});

test('SMARTS and query SMILES', function(t) {
    t.plan(1);
    const q = indigo.loadSmarts('[#8;A]-[*]-[#6;A](-[#9])(-[#9])-[#9]');
    const q2 = indigo.loadQueryMolecule(q.smiles());
    t.equal(q.smiles(), q2.smiles());
});

test('Large symmetric molecule', function(t) {
    t.plan(1);
    const m1 = indigo.loadMoleculeFromFile(local('fixtures/large-symmetric.smi'));
    const m2 = indigo.loadMoleculeFromFile(local('fixtures/large-symmetric.mol'));
    t.equal(m1.smiles(), m2.smiles());
});

test('Symmetric stereocenters and cis-trans bonds', function(t) {
    t.plan(1);
    const m = indigo.loadMolecule('C[C@H]1CCC(CC1)C(\\C1CC[C@H](C)CC1)=C(\\C)C1CCCCC1');
    const m2 = m.clone();
    m.resetSymmetricCisTrans();
    m2.resetSymmetricStereocenters();
    m.resetSymmetricStereocenters();
    t.notEqual(m.smiles(), m2.smiles());
});

test('Remove bonds', function(t) {
    t.plan(1);
    const m = indigo.loadMolecule('CNCNCNCN');
    const correct = 'CN.CN.C.NCN';
    m.removeBonds([1, 3, 4]);
    t.equal(m.smiles(), correct);
});

test('Overlapping stereocenters due to hydrogens folding bug fix check', function(t) {
    t.plan(2);
    const m = indigo.loadMoleculeFromFile(local('fixtures/pubchem-150858.mol'));
    const cs = m.canonicalSmiles();
    m.foldHydrogens();
    const m2 = indigo.loadMolecule(m.molfile());
    const cs2 = m2.canonicalSmiles();
    t.equal(cs, cs2);

    /* another bug check for missing markSterebonds call in the foldHydrogens method */
    m.markStereobonds();
    const m3 = indigo.loadMolecule(m.molfile());
    const cs3 = m3.canonicalSmiles();
    t.equal(cs, cs3);
});

test('SMILES cis-trans check', function(t) {
    t.plan(1);
    const m = indigo.loadMoleculeFromFile(local('fixtures/016_26-large.mol'));
    const correct = '[H]/N=C(\\N)/C1=CC2C(I)=CC=CC=CC=CC=2C=CC=C1 |c:8,10,12,14,18,20,t:4,16|';
    t.equal(m.canonicalSmiles(), correct);
});

test('Empty SDF saver', function(t) {
    t.plan(1);
    const buffer = indigo.writeBuffer();
    const sdfSaver = indigo.createSaver(buffer, 'sdf');
    sdfSaver.close();
    t.equal(buffer.toBuffer().length, buffer.toString().length, 'should be the same length');
});

test('Normalize and serialize', function(t) {
    t.plan(1);
    const mols = ['[O-]/[N+](=C(/[H])\\C1C([H])=C([H])C([H])=C([H])C=1[H])/C1C([H])=C([H])C([H])=C([H])C=1[H]',
        'C\\C=C\\C1=CC=CC(\\C=[N+](/[O-])C2=C(\\C=C\\C)C=CC=C2)=C1'
    ];
    const correctResult = ['[O-]/[N+](=C\\C1C=CC=CC=1)/C1C=CC=CC=1',
        'O=N(=CC1C=CC=CC=1)C1C=CC=CC=1',
        'CC=CC1C=CC=CC=1/[N+](/[O-])=C/C1=CC(/C=C/C)=CC=C1 |t:1|',
        'C/C=C/C1C=CC=CC=1N(=O)=CC1=CC(/C=C/C)=CC=C1',
    ];
    let results = [];
    for (let mol of mols) {
        const m = indigo.loadMolecule(mol);
        results.push(m.canonicalSmiles());
        m.normalize();
        const m2 = indigo.unserialize(m.serialize());
        results.push(m2.canonicalSmiles());
    }
    t.deepEquals(results, correctResult);
});

test('Serialization of aromatic hydrogens', function(t) {
    t.plan(1);
    const m = indigo.loadMolecule('C[c]1(C)ccccc1');
    const q = indigo.loadQueryMolecule('N([H])[H]');
    const m2 = indigo.unserialize(m.serialize());
    const matcher = indigo.substructureMatcher(m2);
    t.equal(matcher.match(q), null, 'should be null');
});
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
    keep: true
});

let testMultipleSave = function(t, smifile, iterfunc, issmi, expectedIndex) {
    let sdfout = indigo.writeFile(tmpDir.name + '/structures.sdf');
    let cmlout = indigo.writeFile(tmpDir.name + '/structures.cml');
    let rdfout = indigo.writeFile(tmpDir.name + '/structures.rdf');
    let smiout = indigo.writeFile(tmpDir.name + '/structures.smi');
    rdfout.rdfHeader();
    cmlout.cmlHeader();
    t.doesNotThrow(() => {
        for (let item of iterfunc(smifile)) {
            let exc = false;
            try {
                item.countAtoms();
                item.smiles();
            } catch (e) {
                if (issmi)
                {
                    t.ok(
                        e.message === 'SMILES loader: atom without a label' ||
                        e.message.startsWith('SMILES loader: chirality not possible on atom')
                    );
                }
                exc = true;
            }
            if (!exc) {
                for (let bond of item.iterateBonds()) {
                    if ((bond.topology() == Indigo.RING) && (bond.bondOrder() == 2)) {
                        bond.resetStereo();
                    }
                }
                try {
                    item.markEitherCisTrans();
                } catch (e) {
                    if (issmi)
                        throw new Error(item.rawData());
                    continue;
                }
                if (issmi) {
                    item.setName('structure-' + item.index() + ' ' + item.rawData());
                } else {
                    item.setName('structure-' + item.index());
                }
                item.setProperty('NUMBER', item.index().toString());
                cmlout.cmlAppend(item);
                smiout.smilesAppend(item);
                item.layout();
                indigo.setOption('molfile-saving-mode', '2000');
                sdfout.sdfAppend(item);
                indigo.setOption('molfile-saving-mode', '3000');
                rdfout.rdfAppend(item);
            }
        }
        cmlout.cmlFooter();
        sdfout.close();
        cmlout.close();
        rdfout.close();
        smiout.close();
    }, 'check right file');
    sdfout.close();
    cmlout.close();
    rdfout.close();
    smiout.close();

    let cmliter = indigo.iterateCMLFile(tmpDir.name + '/structures.cml');
    let sdfiter = indigo.iterateSDFile(tmpDir.name + '/structures.sdf');
    let rdfiter = indigo.iterateRDFile(tmpDir.name + '/structures.rdf');
    let smiiter = indigo.iterateSmilesFile(tmpDir.name + '/structures.smi');
    let sdf;
    t.doesNotThrow(() => {
        let idx = 1;
        while (sdf = sdfiter.next().value) {
            let cml = cmliter.next().value;
            let rdf = rdfiter.next().value;
            let smi = smiiter.next().value;

            sdf.resetSymmetricCisTrans();
            rdf.resetSymmetricCisTrans();
            try {
                let cs1 = sdf.canonicalSmiles();
                let cs2 = rdf.canonicalSmiles();
                let cs3 = smi.canonicalSmiles();
                let cs4 = cml.canonicalSmiles();
                if (cs2 != cs1 || cs3 != cs1 || cs4 != cs1)
                    return;
            } catch (e) {
                continue;
            }
            idx += 1;
        }
        t.equal(idx, expectedIndex);
    }, 'check iterate');
};

// TODO: Check
test('MultipleSave', function(t) {
    t.plan(21);
    testMultipleSave(t, local('fixtures/helma.smi'), indigo.iterateSmilesFile.bind(indigo), true, 685);
    testMultipleSave(t, local('fixtures/chemical-structures.smi'), indigo.iterateSmilesFile.bind(indigo), true, 1396);
    testMultipleSave(t, local('fixtures/pubchem_7m_err.sdf'), indigo.iterateSDFile.bind(indigo), false, 15);
    testMultipleSave(t, local('fixtures/acd2d_err.sdf'), indigo.iterateSDFile.bind(indigo), false, 18);
    tmpDir.removeCallback();
});


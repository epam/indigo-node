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

import { Indigo } from '../indigo';
import IndigoInchi from '../indigo_inchi';

let indigo = new Indigo();
let indigo_inchi = new IndigoInchi(indigo);

// console.log(indigo_inchi.version());

test('Basic', function(t) {
    // console.log('\n#### - InChi test - ####\n');
    t.plan(2);
    let m = indigo_inchi.loadMolecule('InChI=1S/C10H20N2O2/c11-7-1-5-2-8(12)10(14)4-6(5)3-9(7)13/h5-10,13-14H,1-4,11-12H2');
    m.canonicalSmiles();
    t.equals(indigo_inchi.getInchi(m), 'InChI=1S/C10H20N2O2/c11-7-1-5-2-8(12)10(14)4-6(5)3-9(7)13/h5-10,13-14H,1-4,11-12H2', 'check inchi');
    t.equals(indigo_inchi.getWarning(), 'Omitted undefined stereo', 'check warnings');
});

test('Error handling', function(t) {
    t.plan(1);
    let m = indigo.loadMolecule('B1=CB=c2cc3B=CC=c3cc12');
    t.doesNotThrow(() => indigo_inchi.getInchi(m), String, 'get inchi w/o throw');
});

test('Options', function(t) {
    let testOpt = function(m, opt) {
        indigo.setOption('inchi-options', opt);
        if (opt == '/invalid -option')
        {
            let exceptionMessage = '';
            try {
                indigo_inchi.getInchi(m)
            } catch (e) {
                exceptionMessage = e.message;
            }
            t.equal(exceptionMessage, 'inchi-wrapper: Indigo-InChI: Unrecognized option: "invalid".', 'invalid exception for invalid option');
        }
        else
            t.doesNotThrow(() => indigo_inchi.getInchi(m), String, 'check inchi');
    };
    t.plan(7);
    let m = indigo.loadMolecule('CC1CC(C)OC(C)N1');
    testOpt(m, '');
    testOpt(m, '/SUU');
    testOpt(m, '-SUU');
    testOpt(m, '/DoNotAddH /SUU /SLUUD');
    testOpt(m, '-DoNotAddH -SUU -SLUUD');
    testOpt(m, '/DoNotAddH -SUU -SLUUD');
    testOpt(m, '/invalid -option');
});

test('Some molecules', function(t) {
    t.plan(2);
    indigo.setOption('inchi-options', '');
    let input = 'InChI=1S/C6H5.C2H4O2.Hg/c1-2-4-6-5-3-1;1-2(3)4;/h1-5H;1H3,(H,3,4);';
    let m2 = indigo_inchi.loadMolecule(input);
    // aromatize
    indigo_inchi.getInchi(m2);
    m2.aromatize();
    t.equals(indigo_inchi.getInchi(m2), input);

    // aromatize + dearomatize
    indigo_inchi.getInchi(m2);
    m2.aromatize();
    m2.dearomatize();
    t.equals(indigo_inchi.getInchi(m2), input);
});

test('Non-unqiue dearomatization', function(t) {
    t.plan(1);
    let m = indigo.loadMolecule('Cc1nnc2c(N)ncnc12');
    let exceptionMessage = '';
    try {
        indigo_inchi.getInchi(m)
    } catch (e) {
        exceptionMessage = e.message;
    }
    t.equal(exceptionMessage, 'non-unique dearomatization: Dearomatization is not unique', 'invalid exception message for non-unique dearomatization');
});

test('Aux info', function(t) {
    let m = indigo.loadMolecule('Cc1nnc2c(N)ncnc12');
    t.plan(3);

    let correctInchi = 'InChI=1S/C6H7N5/c1-3-4-5(11-10-3)6(7)9-2-8-4/h2H,7H2,1H3,(H,8,9)';
    let correctAux = 'AuxInfo=1/1/N:1,9,2,11,5,6,7,10,8,3,4/rA:11CCNNCCNNCNC/rB:s1;s2;d3;s4;d5;s6;s6;d8;s9;d2s5s10;/rC:;;;;;;;;;;;';
    let correctSmiles = 'CC1=C2NC=NC(N)=C2N=N1';

    m.dearomatize();
    let inchi = indigo_inchi.getInchi(m);
    t.equals(inchi, correctInchi, 'check inchi');
    let aux = indigo_inchi.getAuxInfo();
    t.equals(aux, correctAux, 'check aux');
    let m2 = indigo_inchi.loadMolecule(aux);
    t.equals(m2.smiles(), correctSmiles, 'check smiles');
});
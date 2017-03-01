/****************************************************************************
 * Copyright (C) 2015-2016 EPAM Systems
 *
 * This file is part of Indigo-Node binding.
 *
 * This file may be distributed and/or modified under the terms of the
 * GNU General Public License version 3 as published by the Free Software
 * Foundation and appearing in the file LICENSE.md  included in the
 * packaging of this file.
 *
 * This file is provided AS IS with NO WARRANTY OF ANY KIND, INCLUDING THE
 * WARRANTY OF DESIGN, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 ***************************************************************************/

/* declaration of modules  */
var test = require('tape');

var assert = require('assert');
var path = require('path');
var fs = require('fs');

var Indigo = require("../indigo").Indigo;
var IndigoInchi = require("../indigo_inchi");

var indigo = new Indigo();
var indigo_inchi = new IndigoInchi(indigo);

console.log(indigo_inchi.version());

test('Basic', function (t) {
    console.log('\n#### - InChi test - ####\n');
	t.plan(2);
    var m = indigo_inchi.loadMolecule("InChI=1S/C10H20N2O2/c11-7-1-5-2-8(12)10(14)4-6(5)3-9(7)13/h5-10,13-14H,1-4,11-12H2");
    m.canonicalSmiles();
    t.equals(indigo_inchi.getInchi(m), "InChI=1S/C10H20N2O2/c11-7-1-5-2-8(12)10(14)4-6(5)3-9(7)13/h5-10,13-14H,1-4,11-12H2", 'check inchi');
    t.equals(indigo_inchi.getWarning(), "Omitted undefined stereo", 'check warnings');
});

test('Error handling', function (t) {
	t.plan(1);
    var m = indigo.loadMolecule("B1=CB=c2cc3B=CC=c3cc12");
    t.doesNotThrow(() => indigo_inchi.getInchi(m), String, 'get inchi w/o throw');
});

test('Options', function (t) {
    var testOpt = function (m, opt){
        indigo.setOption("inchi-options", opt);
        if (opt == "/invalid -option")
    		t.throws(() => indigo_inchi.getInchi(m), Error, 'check invalid option error');
        else
        	t.doesNotThrow(() => indigo_inchi.getInchi(m), String, 'check inchi')
    };
	t.plan(7);
    var m = indigo.loadMolecule("CC1CC(C)OC(C)N1");
    testOpt(m, "");
    testOpt(m, "/SUU");
    testOpt(m, "-SUU");
    testOpt(m, "/DoNotAddH /SUU /SLUUD");
    testOpt(m, "-DoNotAddH -SUU -SLUUD");
    testOpt(m, "/DoNotAddH -SUU -SLUUD");
    testOpt(m, "/invalid -option");
});

test('Some molecules', function (t) {
    t.plan(2);
    indigo.setOption("inchi-options", "");
    var input = "InChI=1S/C6H5.C2H4O2.Hg/c1-2-4-6-5-3-1;1-2(3)4;/h1-5H;1H3,(H,3,4);";
    var m2 = indigo_inchi.loadMolecule(input);
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

test('Non-unqiue dearomatization', function (t) {
	t.plan(1);
    var m = indigo.loadMolecule("Cc1nnc2c(N)ncnc12");
    t.throws(() => indigo_inchi.getInchi(m), Error);
});

test('Aux info', function (t) {
    var m = indigo.loadMolecule("Cc1nnc2c(N)ncnc12");
	t.plan(3);

    var correctInchi = "InChI=1S/C6H7N5/c1-3-4-5(11-10-3)6(7)9-2-8-4/h2H,7H2,1H3,(H,8,9)";
    var correctAux = "AuxInfo=1/1/N:1,9,2,11,5,6,7,10,8,3,4/rA:11CCNNCCNNCNC/rB:s1;s2;d3;s4;d5;s6;s6;d8;s9;d2s5s10;/rC:;;;;;;;;;;;";
    var correctSmiles = "CC1=C2NC=NC(N)=C2N=N1";

    m.dearomatize();
    var inchi = indigo_inchi.getInchi(m);
    t.equals(inchi, correctInchi, 'check inchi');
    var aux = indigo_inchi.getAuxInfo();
    t.equals(aux, correctAux, 'check aux');
    var m2 = indigo_inchi.loadMolecule(aux);
    t.equals(m2.smiles(), correctSmiles, 'check smiles');
});

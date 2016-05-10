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
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var local = path.join.bind(path, __dirname);

var Indigo = require("../indigo-node/indigo");
var indigo = new Indigo({ exception: true });
var IndigoInchi = require("../indigo-node/indigo_inchi");
var indigo_inchi = new IndigoInchi(indigo);

console.log(indigo_inchi.version());

console.log("*** Basic *** ");
var m = indigo_inchi.loadMolecule("InChI=1S/C10H20N2O2/c11-7-1-5-2-8(12)10(14)4-6(5)3-9(7)13/h5-10,13-14H,1-4,11-12H2");
console.log(m.canonicalSmiles());
console.log(indigo_inchi.getInchi(m));
console.log(indigo_inchi.getWarning());

console.log("*** Error handling *** ");
var m = indigo.loadMolecule("B1=CB=c2cc3B=CC=c3cc12");
try {
	console.log(indigo_inchi.getInchi(m));
}
catch (e) {
	console.log("Error: %s\n", e.message);
}

console.log("*** Options *** ");
var testOpt = function (m, opt){
	try {
		indigo.setOption("inchi-options", opt);
		console.log(indigo_inchi.getInchi(m));
	}
	catch (e) {
		console.log("Error: %s\n", e.message);
	}
}

m = indigo.loadMolecule("CC1CC(C)OC(C)N1");
testOpt(m, "");
testOpt(m, "/SUU");
testOpt(m, "-SUU");
testOpt(m, "/DoNotAddH /SUU /SLUUD");
testOpt(m, "-DoNotAddH -SUU -SLUUD");
testOpt(m, "/DoNotAddH -SUU -SLUUD");
testOpt(m, "/invalid -option");


console.log("*** Some molecules *** ");
indigo.setOption("inchi-options", "");
input = "InChI=1S/C6H5.C2H4O2.Hg/c1-2-4-6-5-3-1;1-2(3)4;/h1-5H;1H3,(H,3,4);"
console.log(input);
var m2 = indigo_inchi.loadMolecule(input);

console.log("Arom");
try {
	var inchi2 = indigo_inchi.getInchi(m2);
	console.log(inchi2);
	m2.aromatize();
	var inchi2 = indigo_inchi.getInchi(m2);
	console.log(inchi2);
}
catch (e) {
	console.log("Error: %s\n", e.message);
}
	
console.log("Arom/dearom");
try {
	var inchi2 = indigo_inchi.getInchi(m2);
	console.log(inchi2);
	m2.aromatize();
	m2.dearomatize();
	var inchi2 = indigo_inchi.getInchi(m2);
	console.log(inchi2);
}
catch (e) {
	console.log("Error: %s\n", e.message);
}

console.log("*** Non-unqiue dearomatization ***");
try {
	var m = indigo.loadMolecule("Cc1nnc2c(N)ncnc12");
	var inchi = indigo_inchi.getInchi(m);
	console.log(inchi);
}
catch (e) {
	console.log("Error: %s\n", e.message);
}

console.log("*** Aux info ***");
var m = indigo.loadMolecule("Cc1nnc2c(N)ncnc12");
m.dearomatize();
var inchi = indigo_inchi.getInchi(m);
var aux = indigo_inchi.getAuxInfo();
console.log(inchi);
console.log(aux);
var m2 = indigo_inchi.loadMolecule(aux);
console.log(m2.smiles());

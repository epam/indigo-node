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
var indigo = new Indigo();

var data = fs.readFileSync(local("../indigo-node/molecules/stereo_parity.sdf"));
console.log(data.toString());

console.log("*** SDF loadString ***");
for (var m of indigo.iterateSDF(indigo.loadString(data.toString()))) {
	console.log(m.smiles());
}

console.log("*** SDF loadBuffer ***");
for (var m of indigo.iterateSDF(indigo.loadBuffer(data))) {
	console.log(m.smiles());
}

var data = fs.readFileSync(local("../indigo-node/molecules/helma.smi"));
console.log(data.toString());

console.log("*** SMILES loadString ***");
for (var m of indigo.iterateSmiles(indigo.loadString(data.toString()))) {
	console.log(m.smiles());
}

console.log("*** SMILES loadBuffer ***");
for (var m of indigo.iterateSmiles(indigo.loadBuffer(data))) {
	console.log(m.smiles());
}

var data = fs.readFileSync(local("../indigo-node/molecules/tetrahedral-all.cml"));
console.log(data.toString());

console.log("*** CML loadString ***");
for (var m of indigo.iterateCML(indigo.loadString(data.toString()))) {
	console.log(m.smiles());
}

console.log("*** CML loadBuffer ***");
for (var m of indigo.iterateCML(indigo.loadBuffer(data))) {
	console.log(m.smiles());
}

var data = fs.readFileSync(local("../indigo-node/reactions/rxns.rdf"));
console.log(data.toString());

console.log("*** RDF loadString ***");
for (var m of indigo.iterateRDF(indigo.loadString(data.toString()))) {
	console.log(m.smiles());
}

console.log("*** RDF loadBuffer ***");
for (var m of indigo.iterateRDF(indigo.loadBuffer(data))) {
	console.log(m.smiles());
}


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


console.log("**** Read SDF.GZ ****")
var readSdfAndPrintInfo = function (fname) {
	for (var m of indigo.iterateSDFile(local(fname))) {
		console.log("*****");
		console.log("Smiles:");
		console.log(m.smiles());
		console.log("Molfile:");
		console.log(m.molfile());
		console.log("Rawdata:");
		console.log(m.rawData());
		console.log("Properties:");
		for (var prop of m.iterateProperties())
			console.log("%s: %s", prop.name(), prop.rawData());
	}
};

readSdfAndPrintInfo('../indigo-node/molecules/Compound_0000001_0000250.sdf.gz');

console.log("**** Save and load molecule names from SDF ****");
sdf_file_name = local("sdf-names.sdf");
var saver = indigo.createFileSaver(sdf_file_name, "sdf")
var names = [];
for (i = 0; i < 10; i++) {
	names.push(i.toString());
	names.push("Name"+ i);
	names.push("Much longer name"+ i);
}

for (name of names) {
	var m = indigo.createMolecule();
	m.setName(name);
	saver.append(m);
}

saver.close();

var checkMolNames = function (names, sdf_file_name) {
	var i = 0;
	for (var m of indigo.iterateSDFile(sdf_file_name)) {
		console.log(m.name());
		if (m.name() != names[i])
			console.log("Names are different: %s != %s", m.name(), name);
		i++;
	}
}

checkMolNames(names, sdf_file_name);

console.log("** Use sdfAppend **");
var sdf_file_name = local("sdf-names-2.sdf");
var sdf = indigo.writeFile(sdf_file_name);

for (var name of names) {
	var m = indigo.createMolecule();
	m.setName(name);
	sdf.sdfAppend(m)
}
sdf.close();

checkMolNames(names, sdf_file_name);

console.log("**** Read SDF with invalid header ****");
readSdfAndPrintInfo('../indigo-node/molecules/bad-header.sdf');


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
var local = path.join.bind(path, __dirname);

var indigo = require("../indigo-node/indigo");

console.log('indigo basic test');
console.log('start:');

var status = indigo.setOption("molfile-saving-skip-date", "1");
console.log("****** Query reload ********")
q = indigo.loadQueryMoleculeFromFile(local("../indigo-node/molecules/q_atom_list.mol"));
qmf1 = q.molfile();
console.log(qmf1);
q2 = indigo.loadQueryMolecule(q.molfile());
qmf2 = q2.molfile();
if (qmf1 != qmf2) {
	console.log("Error: reloaded query is different:");
	console.log(qmf2);
}
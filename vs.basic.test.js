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
var q = indigo.loadQueryMoleculeFromFile(local("../indigo-node/molecules/q_atom_list.mol"));
var qmf1 = q.molfile();
console.log(qmf1);
var q2 = indigo.loadQueryMolecule(q.molfile());
var qmf2 = q2.molfile();
if (qmf1 != qmf2) {
	console.log("Error: reloaded query is different:");
	console.log(qmf2);
}

/* Check that queires are equivalent */
var matcher = indigo.substructureMatcher(indigo.loadMolecule("[Sc]CN[He]"));
var none1 = matcher.match(q);
var none2 = matcher.match(q2);
if (none1 || none2)
	console.log("Error: matching results are not None: " + none1 + ' ' + none2);

console.log("****** Remove constraints and reload ********");
var q = indigo.loadQueryMolecule("c1[nH]c2c(c(N)[n+]([O-])c[n]2)[n]1");
var t = indigo.loadMolecule("c1[n]c2c(N)[n+]([O-])c[n]c2[n]1[C@H]1[C@@H](O)[C@H](O)[C@H](CO)O1");

var original_smiles = q.smiles();
console.log(q.smiles());

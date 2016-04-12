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

var matcher = indigo.substructureMatcher(t);
var has_match_orig = (matcher.match(q) != null);
console.log(has_match_orig);

for (var a of q.iterateAtoms())
	a.removeConstraints("hydrogens");
console.log(q.smiles());

var has_match = (matcher.match(q) != null);
console.log(has_match);

var q2 = q.clone();
console.log(q2.smiles());
var has_match2 = (matcher.match(q2) != null)
console.log(has_match2);
if (has_match != has_match2)
	console.error("Error: query molecule match is different after cloning");

/* reload query from original smiles */
var q3 = indigo.loadQueryMolecule(original_smiles)
console.log(q3.smiles());
var has_match3 = (matcher.match(q3) != null)
console.log(has_match3);
if (has_match3 != has_match_orig)
	console.error("Error: query molecule match is different after reloading from SMILES");

console.log("****** Bad valence, smiles and unfold ********");
var m = indigo.loadMolecule("C\C=C(/N(O)=O)N(O)=O");
var sm = m.smiles();
console.log(m.smiles());
console.log(m.canonicalSmiles());
m.unfoldHydrogens();

/* If there was an exception in unfoldHydrogens then molecule should not be changed */
var sm2 = m.smiles();
if (sm2 != sm)
	console.error("Error: " + sm + " != " + sm2);

console.log("****** Serialize and atom changing ********");
var m = indigo.loadMolecule("CC[C@@H](N)\C=C/C");
console.log(m.smiles());
console.log(m.canonicalSmiles());

for (a of m.iterateAtoms())
	a.resetAtom("*");

console.log(m.smiles());
console.log(m.canonicalSmiles());

var m2 = indigo.unserialize(m.serialize());
console.log(m2.smiles());
console.log(m2.canonicalSmiles());

console.log("****** Anormal properties ********")
var m = indigo.loadMolecule("[WH7][W][W][W+10][W][W-10]")
for (a of m.iterateAtoms())
console.log(" "+a.charge()+" "+a.valence());


m2 = indigo.unserialize(m.serialize());
console.log(m2.smiles())
console.log(m2.canonicalSmiles())
for (a of m2.iterateAtoms())
console.log(" "+a.charge()+" "+a.valence());

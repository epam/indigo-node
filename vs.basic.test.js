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

for (var a of m.iterateAtoms())
	a.resetAtom("*");

console.log(m.smiles());
console.log(m.canonicalSmiles());

var m2 = indigo.unserialize(m.serialize());
console.log(m2.smiles());
console.log(m2.canonicalSmiles());

console.log("****** Anormal properties ********");
var m = indigo.loadMolecule("[WH7][W][W][W+10][W][W-10]");
for (var a of m.iterateAtoms())
console.log(" "+a.charge()+" "+a.valence());


var m2 = indigo.unserialize(m.serialize());
console.log(m2.smiles());
console.log(m2.canonicalSmiles());
for (var a of m2.iterateAtoms())
console.log(" "+a.charge()+" "+a.valence());

console.log("****** Unmarked stereobonds ********");
var m = indigo.loadMoleculeFromFile(local("../indigo-node/molecules/stereo.mol"));
console.log(m.canonicalSmiles());
m.clearStereocenters();
console.log(m.canonicalSmiles());

var m2 = indigo.loadMolecule(m.molfile());
console.log(m2.canonicalSmiles());
if (m.canonicalSmiles() != m2.canonicalSmiles())
	console.error("Error: canonical smiles are different");

console.log("****** Chemical formula ********");
console.log(indigo.loadMolecule("[Br][I]").grossFormula());
console.log(indigo.loadMolecule("[Br][H]").grossFormula());
console.log(indigo.loadMolecule("OS(=O)(=O)O").grossFormula());
console.log(indigo.loadMolecule("CI").grossFormula());
console.log(indigo.loadMolecule("CCBr").grossFormula());
console.log(indigo.loadMolecule("[H]O[H]").grossFormula());
console.log(indigo.loadMolecule("c1ccccc1").grossFormula());
console.log(indigo.loadMolecule("c1ccccc1[He]").grossFormula());
console.log(indigo.loadMolecule("c1ccccc1[He][Br]").grossFormula());

console.log("****** Nei iterator ********");
var m = indigo.loadMolecule("CCC1=CC2=C(C=C1)C(CC)=CC(CC)=C2");
for (var v of m.iterateAtoms())
{
	console.log("v:"+v.index());
	for (var nei of v.iterateNeighbors())
		console.log("  neighbor atom "+nei.index()+"is connected by bond "+nei.bond().index());
}

console.log("****** Structure normalization ********");
var m = indigo.loadMolecule("[H]N(C)C(\\[H])=C(\\[NH2+][O-])N(=O)=O");
console.log(m.smiles());
console.log(m.normalize(""));
console.log(m.smiles());
console.log(m.normalize(""));
console.log(m.smiles());

console.log("****** R-group big index ********")
var mols = ["molecules/r31.mol", "molecules/r32.mol", "molecules/r128.mol" ]
for (var molfile of mols)
{
	for (var obj of [ {"loader":indigo.loadMoleculeFromFile, "type":"molecule"}, {"loader":indigo.loadQueryMoleculeFromFile, "type":"query"} ])
	{
		console.log(molfile + " " + obj.type + ":");
		var m = obj.loader.call(indigo,local("../indigo-node/"+ molfile));
		var str = m.molfile(); // check molfile generation
		console.log("  " + m.smiles());
	}
}

console.log("****** Smiles with R-group ********");
var smiles_set = [ "NC****", "**NC**", "****NC" ];
for (var smiles of smiles_set)
{
	console.log("Smiles: " + smiles);
	var m = indigo.loadMolecule(smiles);
	console.log("  Smiles:      " + m.smiles());
	console.log("  Cano smiles: " + m.canonicalSmiles());
	for (var a of m.iterateAtoms())
		console.log(" "+ a.index()+" "+a.symbol());
}

console.log("****** Smiles <-> Molfile ********");
var m = indigo.loadQueryMolecule("[CH6]");
console.log(m.smiles());
for (var val of [ "2000", "3000", "auto" ])
{
	console.log(" molfile-saving-mode: " + (val));
	indigo.setOption("molfile-saving-mode", val);
	var m2 = indigo.loadMolecule(m.molfile());
	console.log(m2.smiles());
	var m3 = indigo.loadQueryMolecule(m.molfile());
	console.log(m3.smiles());
}

console.log("****** SMARTS and query SMILES ********");
var q = indigo.loadSmarts("[#8;A]-[*]-[#6;A](-[#9])(-[#9])-[#9]");
console.log(q.smiles());
var q2 = indigo.loadQueryMolecule(q.smiles());
console.log(q2.smiles());

console.log("****** Large symmetric molecule ********");
var m = indigo.loadMoleculeFromFile(local("../indigo-node/molecules/large-symmetric.smi"));
console.log(m.smiles());
var m = indigo.loadMoleculeFromFile(local("../indigo-node/molecules/large-symmetric.mol"));
console.log(m.smiles());

console.log("****** Symmetric stereocenters and cis-trans bonds ********");
var m = indigo.loadMolecule("C[C@H]1CCC(CC1)C(\C1CC[C@H](C)CC1)=C(\C)C1CCCCC1");
console.log(m.smiles());
var m2 = m.clone();
m.resetSymmetricCisTrans();
console.log(m.smiles());
m2.resetSymmetricStereocenters();
console.log(m2.smiles());
m.resetSymmetricStereocenters();
console.log(m.smiles());

console.log("****** Remove bonds ********");
var m = indigo.loadMolecule("CNCNCNCN");
console.log(m.smiles());
m.removeBonds([1, 3, 4]);
console.log(m.smiles());

console.log("****** Overlapping stereocenters due to hydrogens folding bug fix check *****");
var m = indigo.loadMoleculeFromFile(local("../indigo-node/molecules/pubchem-150858.mol"));
var cs = m.canonicalSmiles();
console.log(cs);
m.foldHydrogens();
var m2 = indigo.loadMolecule(m.molfile());
var cs2 = m2.canonicalSmiles();
console.log(cs2);
if (cs !== cs2)
	console.error("Bug!");

/* another bug check for missing markSterebonds call in the foldHydrogens method */
m.markStereobonds();
var m3 = indigo.loadMolecule(m.molfile());
cs3 = m3.canonicalSmiles();
console.log(cs3);
if (cs != cs3)
	console.log("Bug!");

console.log("****** SMILES cis-trans check *****");
var m = indigo.loadMoleculeFromFile(local("../indigo-node/molecules/016_26-large.mol"));
console.log(m.smiles());
console.log(m.canonicalSmiles());

console.log("****** Empty SDF saver *****");
var buffer = indigo.writeBuffer();
var sdfSaver = indigo.createSaver(buffer, "sdf");
sdfSaver.close();
console.log(buffer.toBuffer().length);
console.log(buffer.toString().length);

console.log("****** Normalize and serialize *****");
var mols = ["[O-]/[N+](=C(/[H])\\C1C([H])=C([H])C([H])=C([H])C=1[H])/C1C([H])=C([H])C([H])=C([H])C=1[H]",
			"C\\C=C\\C1=CC=CC(\\C=[N+](/[O-])C2=C(\\C=C\\C)C=CC=C2)=C1"];
for (var mstr of mols)
{
	var m = indigo.loadMolecule(mstr);
	console.log(m.canonicalSmiles());
	m.normalize();
	var m2 = indigo.unserialize(m.serialize());
	console.log(m2.canonicalSmiles());
}

console.log("***** Serialization of aromatic hydrogens *****");
var m = indigo.loadMolecule("C[c]1(C)ccccc1");
var q = indigo.loadQueryMolecule("N([H])[H]");
var m2 = indigo.unserialize(m.serialize());
var matcher = indigo.substructureMatcher(m2);
assert(matcher.match(q) == null);

/****************************************************************************
 * Copyright (C) 2016-2017 EPAM Systems
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
var test = require('tap').test;

var assert = require('assert');
var path = require('path');
var local = path.join.bind(path, __dirname);

var Indigo = require("../indigo").Indigo;
var IndigoException = require("../indigo").IndigoException;
var indigo = new Indigo();

var status = indigo.setOption("molfile-saving-skip-date", "1");

test('Query reload', function (t) {
    // console.log('\n#### - Indigo basic test - ####\n');

	t.plan(2);

	var q = indigo.loadQueryMoleculeFromFile(local("fixtures/q_atom_list.mol"));
	var qmf1 = q.molfile();
	var q2 = indigo.loadQueryMolecule(q.cml());
	var qmf2 = q2.molfile();
	t.equal(qmf1, qmf2, 'reloaded query should be equal');

	/* Check that queires are equivalent */
	var matcher = indigo.substructureMatcher(indigo.loadMolecule("[Sc]CN[He]"));
	var none1 = matcher.match(q);
	var none2 = matcher.match(q2);
	t.notOk(none1 || none2, 'matching results should be None');
});

test('Remove constraints and reload', function (t) {
	t.plan(2);

	var q = indigo.loadQueryMolecule("c1[nH]c2c(c(N)[n+]([O-])c[n]2)[n]1");
	var tmp = indigo.loadMolecule("c1[n]c2c(N)[n+]([O-])c[n]c2[n]1[C@H]1[C@@H](O)[C@H](O)[C@H](CO)O1");
	var matcher = indigo.substructureMatcher(tmp);

	var original_smiles = q.smiles();
	var has_match_orig = (matcher.match(q) != null);
	// console.log(q.smiles() + ' ' + has_match_orig);

	for (var atom of q.iterateAtoms())
		atom.removeConstraints("hydrogens");
	var has_match = (matcher.match(q) != null);
	// console.log(q.smiles() + ' ' + has_match);

	var q2 = q.clone();
	var has_match2 = (matcher.match(q2) != null);
	// console.log(q2.smiles() + ' ' + has_match2);
	t.equal(has_match, has_match2, 'query molecule match should be the same after cloning');

	/* reload query from original smiles */
	var q3 = indigo.loadQueryMolecule(original_smiles);
	var has_match3 = (matcher.match(q3) != null);
	// console.log(q3.smiles() + ' ' + has_match3);
	t.equal(has_match3, has_match_orig, 'query molecule match should be the same after reloading from SMILE');
});

test('Bad valence, smiles and unfold', function (t) {
	t.plan(2);
	var m1 = indigo.loadMolecule("C\\C=C(/N(O)=O)N(O)=O");

	var sm = m1.smiles();
	// console.log(m1.smiles());
	// console.log(m1.canonicalSmiles());
	t.throws(m1.unfoldHydrogens(), IndigoException); // If exception then molecule should not be changed

	var sm2 = m1.smiles();
	t.equal(sm2, sm, 'should be equal');
});

test('Serialize and atom changing', function (t) {
	t.plan(2);
	var m = indigo.loadMolecule("CC[C@@H](N)\\C=C/C");
	// console.log(m.smiles());
	// console.log(m.canonicalSmiles());

	for (var a of m.iterateAtoms())
		a.resetAtom("*");
	t.ok(m.smiles(), 'atom changing');

	var m2 = indigo.unserialize(m.serialize());
	t.ok(m2.smiles(), 'serialize');
});

test('Anormal properties', function (t) {
	t.plan(1);
	var a = {};
	var m = indigo.loadMolecule("[WH7][W][W][W+10][W][W-10]");
	var strM = '';
	for (a of m.iterateAtoms())
		strM += ' ' + a.charge() + ' ' + a.valence() + '\n';

	var strM2 = '';
	var m2 = indigo.unserialize(m.serialize());
	for (a of m2.iterateAtoms())
		strM2 += ' ' + a.charge() + ' ' + a.valence() + '\n';
	t.equal(strM, strM2);
});

test('Unmarked stereobonds', function (t) {
	t.plan(1);
	var m = indigo.loadMoleculeFromFile(local("fixtures/stereo.mol"));
	m.clearStereocenters();
	var m2 = indigo.loadMolecule(m.molfile());

	t.equal(m.canonicalSmiles(), m2.canonicalSmiles(), 'canonical smiles should be equal');
});

test('Chemical formula', function (t) {
	t.plan(1);
	var correctFormulas = [
		'Br I',
		'Br H',
		'H2 O4 S',
		'C H3 I',
		'C2 H5 Br',
		'H2 O',
		'C6 H6',
		'C6 H5 He',
		'C6 H5 Br He'];
	var ourFormulas = [
		indigo.loadMolecule("[Br][I]").grossFormula(),
		indigo.loadMolecule("[Br][H]").grossFormula(),
		indigo.loadMolecule("OS(=O)(=O)O").grossFormula(),
		indigo.loadMolecule("CI").grossFormula(),
		indigo.loadMolecule("CCBr").grossFormula(),
		indigo.loadMolecule("[H]O[H]").grossFormula(),
		indigo.loadMolecule("c1ccccc1").grossFormula(),
		indigo.loadMolecule("c1ccccc1[He]").grossFormula(),
		indigo.loadMolecule("c1ccccc1[He][Br]").grossFormula()
	];
	t.deepEqual(ourFormulas, correctFormulas);
});

test('Nei iterator', function (t) {
	t.plan(1);
	var m = indigo.loadMolecule("CCC1=CC2=C(C=C1)C(CC)=CC(CC)=C2");
	var correctNeiBonds = {
		'0': ['1 0'],
		'1': ['0 0', '2 1'],
		'2': ['1 1', '3 2', '7 7'],
		'3': ['2 2', '4 3'],
		'4': ['3 3', '5 4', '15 16'],
		'5': ['4 4', '6 5', '8 8'],
		'6': ['5 5', '7 6'],
		'7': ['6 6', '2 7'],
		'8': ['5 8', '9 9', '11 11'],
		'9': ['8 9', '10 10'],
		'10': ['9 10'],
		'11': ['8 11', '12 12'],
		'12': ['11 12', '13 13', '15 15'],
		'13': ['12 13', '14 14'],
		'14': ['13 14'],
		'15': ['12 15', '4 16']
	};
	var neiBonds = {};
	for (var v of m.iterateAtoms()) {
		neiBonds[v.index()] = [];
		for (var nei of v.iterateNeighbors()) {
			neiBonds[v.index()].push(nei.index() + ' ' + nei.bond().index());
		}
	}
	t.deepEqual(neiBonds, correctNeiBonds);
});

test('Structure normalization', function (t) {
	t.plan(1);
	var m = indigo.loadMolecule("[H]N(C)C(\\[H])=C(\\[NH2+][O-])N(=O)=O");
	m.smiles();
	m.normalize("");
	var sm1 = m.smiles();
	m.normalize("");
	var sm2 = m.smiles();
	t.equal(sm1, sm2);
});

test('R-group big index', function (t) {
	t.plan(6);
	var mols = ["r31.mol", "r32.mol", "r128.mol"];
	for (var molfile of mols) {
		if (molfile == "r128.mol") {
			t.throws(() => indigo.loadMoleculeFromFile(local("fixtures/" + molfile)), Object);
			t.throws(() => indigo.loadQueryMoleculeFromFile(local("fixtures/" + molfile)), Object);
		} else {
			t.doesNotThrow(() => indigo.loadMoleculeFromFile(local("fixtures/" + molfile)), Object);
			t.doesNotThrow(() => indigo.loadQueryMoleculeFromFile(local("fixtures/" + molfile)), Object);
		}
	}
});

test('Smiles with R-group', function (t) {
	t.plan(3);
	var smiles_set = [ "NC****", "**NC**", "****NC" ];
	var rightAtoms = {
		"NC****": '0 N;1 C;2 R;3 R;4 R;5 R;',
		"**NC**": '0 R;1 R;2 N;3 C;4 R;5 R;',
		"****NC": '0 R;1 R;2 R;3 R;4 N;5 C;'
	};
	for (var smiles of smiles_set) {
		var m = indigo.loadMolecule(smiles);
		var tmpAtoms = '';
		for (var a of m.iterateAtoms())
			tmpAtoms += a.index() + ' ' + a.symbol() + ';';
		t.equal(tmpAtoms, rightAtoms[smiles], smiles);
	}
});

test('Smiles <-> Molfile', function (t) {
	var m = indigo.loadQueryMolecule("[CH6]");
	t.plan(3);
	for (var val of [ "2000", "3000", "auto" ]) {
		indigo.setOption("molfile-saving-mode", val);
		var m2 = indigo.loadMolecule(m.molfile());
		var m3 = indigo.loadQueryMolecule(m.molfile());
		t.deepEqual(m2.smiles(), m3.smiles()," molfile-saving-mode: " + val);
	}
});

test('SMARTS and query SMILES', function (t) {
	t.plan(1);
	var q = indigo.loadSmarts("[#8;A]-[*]-[#6;A](-[#9])(-[#9])-[#9]");
	var q2 = indigo.loadQueryMolecule(q.smiles());
	t.equal(q.smiles(), q2.smiles());
});

test('Large symmetric molecule', function (t) {
	t.plan(1);
	var m1 = indigo.loadMoleculeFromFile(local("fixtures/large-symmetric.smi"));
	var m2 = indigo.loadMoleculeFromFile(local("fixtures/large-symmetric.mol"));
	t.equal(m1.smiles(), m2.smiles());
});

test('Symmetric stereocenters and cis-trans bonds', function (t) {
	t.plan(1);
	var m = indigo.loadMolecule("C[C@H]1CCC(CC1)C(\\C1CC[C@H](C)CC1)=C(\\C)C1CCCCC1");
	var m2 = m.clone();
	m.resetSymmetricCisTrans();
	m2.resetSymmetricStereocenters();
	m.resetSymmetricStereocenters();
	t.notEqual(m.smiles(), m2.smiles());
});

test('Remove bonds', function (t) {
	t.plan(1);
	var m = indigo.loadMolecule("CNCNCNCN");
	var correct = 'CN.CN.C.NCN';
	m.removeBonds([1, 3, 4]);
	t.equal(m.smiles(),correct);
});

test('Overlapping stereocenters due to hydrogens folding bug fix check', function (t) {
	t.plan(2);
	var m = indigo.loadMoleculeFromFile(local("fixtures/pubchem-150858.mol"));
	var cs = m.canonicalSmiles();
	m.foldHydrogens();
	var m2 = indigo.loadMolecule(m.molfile());
	var cs2 = m2.canonicalSmiles();
	t.equal(cs, cs2);

	/* another bug check for missing markSterebonds call in the foldHydrogens method */
	m.markStereobonds();
	var m3 = indigo.loadMolecule(m.molfile());
	var cs3 = m3.canonicalSmiles();
	t.equal(cs, cs3);
});

test('SMILES cis-trans check', function (t) {
	t.plan(1);
	var m = indigo.loadMoleculeFromFile(local("fixtures/016_26-large.mol"));
	var correct = '[H]/N=C(\\N)/C1=CC2C(I)=CC=CC=CC=CC=2C=CC=C1 |c:8,10,12,14,18,20,t:4,16|';
	t.equal(m.canonicalSmiles(), correct);
});

test('Empty SDF saver', function (t) {
	t.plan(1);
	var buffer = indigo.writeBuffer();
	var sdfSaver = indigo.createSaver(buffer, "sdf");
	sdfSaver.close();
	t.equal(buffer.toBuffer().length, buffer.toString().length, 'should be the same length');
});

test('Normalize and serialize', function (t) {
	t.plan(1);
	var mols = ["[O-]/[N+](=C(/[H])\\C1C([H])=C([H])C([H])=C([H])C=1[H])/C1C([H])=C([H])C([H])=C([H])C=1[H]",
		"C\\C=C\\C1=CC=CC(\\C=[N+](/[O-])C2=C(\\C=C\\C)C=CC=C2)=C1"];
	var correctResult = ['[O-]/[N+](=C\\C1C=CC=CC=1)/C1C=CC=CC=1',
		'O=N(=CC1C=CC=CC=1)C1C=CC=CC=1',
		'CC=CC1C=CC=CC=1/[N+](/[O-])=C/C1=CC(/C=C/C)=CC=C1 |t:1|',
		'C/C=C/C1C=CC=CC=1N(=O)=CC1=CC(/C=C/C)=CC=C1'
	];
	var results = [];
	for (var mol of mols) {
		var m = indigo.loadMolecule(mol);
		results.push(m.canonicalSmiles());
		m.normalize();
		var m2 = indigo.unserialize(m.serialize());
		results.push(m2.canonicalSmiles());
	}
	t.deepEquals(results, correctResult);
});

test('Serialization of aromatic hydrogens', function (t) {
	t.plan(1);
	var m = indigo.loadMolecule("C[c]1(C)ccccc1");
	var q = indigo.loadQueryMolecule("N([H])[H]");
	var m2 = indigo.unserialize(m.serialize());
	var matcher = indigo.substructureMatcher(m2);
	t.equal(matcher.match(q), null, 'should be null');
});

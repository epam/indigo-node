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
var lyopset = {
	"embedding-uniqueness": ["atoms", "bonds", "none"],
	"midle": [6, 7],
	"max-embeddings": [20, 0, 1, 5, 500, 10000, 50000], 
	"*embeddings limit*": [0, 200],
	"last": 3,
	"lalast": 5
};

var createVolume = function (obj, level)
{
	var lev = level || 0;
	var pro = Object.create(obj);
	obj_n = Object.assign(pro,obj);
	for (var key of Object.keys(obj)) {
		delete obj_n[key];
		//console.log("key:" + key + "val:" + obj[key]);
		var iter = (Array.isArray(obj[key]))? obj[key]:[obj[key]];
		if (Object.getOwnPropertyNames(obj_n).length) {
			var ret = createVolume(obj_n, lev + 1);
			for (var arr of iter) {
				for (var el of ret.value) {
					if(!ret.level) {
						ret.array.push([[key, arr],[ret.key, el]]);
					//	console.log([[key, arr],[ret.key, el]]);
					}else{
						ret.array.push([[key, arr]].concat(el));
					//	console.log([[key, arr]].concat(el));
					}
				}
			}
			if (lev)
				return { key: key, value: ret.array, array: [], level: 1 };
			else
				return ret.array;
		}
		else {
			return { key: key, value: iter, array: [], level: 0 };
		}
	}
} 

test = createVolume(lyopset);

var checkHasMatchMol = function (indigo, m, q) {
	q.aromatize();
	m.checkBadValence();
	m.checkBadValence();
	var matcher = indigo.substructureMatcher(m);
	assert(matcher.match(q) != null);
	
	var m2 = indigo.unserialize(m.serialize());
	var matcher2 = indigo.substructureMatcher(m2)
	assert(matcher2.match(q) != null);
	q.optimize();
	assert(matcher.match(q) != null);
	assert(matcher2.match(q) != null)
};

var checkHasMatch = function (indigo, targetName, queryName) {
	console.log(targetName + " " + queryName);
	var q = indigo.loadQueryMoleculeFromFile(local("../indigo-node/"+queryName));
	var m = indigo.loadMoleculeFromFile(local("../indigo-node/"+targetName));
	checkHasMatchMol(indigo, m, q);
};

console.log("***** Substructure with either and bidirectional mode *****");
indigo.setOption("stereochemistry-bidirectional-mode", true);
checkHasMatch(indigo, "molecules/either1.mol", "molecules/either1.mol");
checkHasMatch(indigo, "molecules/either1.mol", "molecules/either2.mol");
checkHasMatch(indigo, "molecules/either1.mol", "molecules/either1_query.mol");

var mol = indigo.loadMolecule('C1C=CC=CC=1');
mol.aromatize();
var q = indigo.loadQueryMolecule("C:C:C");
var m = indigo.substructureMatcher(mol).match(q);
if (m === null)
	console.log("not matched");
else
	console.log(m.highlightedTarget().smiles());

var FullTest = function (mol, q) {
	var matcher = indigo.substructureMatcher(mol);
	//indigo.dbgBreakpoint();
	var cnt = matcher.countMatches(q);
	console.log("count = " + cnt);
	
	var testUnmappedAtoms = function (q, match, t) {
		var unmapped = 0;
		for (atom of q.iterateAtoms()) {
			mapped = match.mapAtom(atom)
			if (mapped == null)
				unmapped += 1;
			else
				mapped.index();
			console.log("  unmapped = " + unmapped);
		}
	};
	var testEmbeddingCount = function (matcher, q, t, emb_limit) {
		var cnt = -1;
		var cnt = matcher.countMatches(q);
		console.log("  count = " + cnt);
		var cnt2 = 0;
		for (m of matcher.iterateMatches(q)) {
			cnt2 += 1;
			if (cnt2 < 4)
				testUnmappedAtoms(q, m, t);
		}
		console.log("  count by iterate = " + cnt2);
		if (cnt != -1 && cnt2 != cnt) {
			console.error("    countMatches(q) != len(iterateMatches(q))");
			console.log("    cnt2 != cnt: %d != %d", cnt, cnt2);
		}
		var cnt3 = matcher.countMatchesWithLimit(q, emb_limit);
		console.log("  count with limit %d = %d" , emb_limit, cnt3);
		if (emb_limit != 0 && cnt3 > emb_limit) {
			console.error("    cnt3 > emb_limit");
			console.log("    cnt3 > emb_limit: %d > %d", cnt3, emb_limit);
		}
	}
	var opset = {
		"embedding-uniqueness": ["atoms", "bonds", "none"],
		"max-embeddings": [20, 0, 1, 5, 500, 10000, 50000], 
		"*embeddings limit*": [0, 200]
	};
	
	var opt_combintations = createVolume(opset);

	for (var opt_set of opt_combintations) {
		console.log("Test set:");
		try {
			var isok = false;
			var emb_limit = -1
			for (opt_tuple of opt_set){
				console.log("  (" + opt_tuple[0]+","+ opt_tuple[1] +")");
				if (opt_tuple[0] != '*embeddings limit*')
					indigo.setOption(opt_tuple[0], opt_tuple[1]);
				else
					emb_limit = opt_tuple[1];
			}
			testEmbeddingCount(matcher, q, mol, emb_limit);
		}
		catch (e){
			console.log(e.message);
		}
	}
};

var loadWithCheck = function (func) {
	var wrapper = function (param) {
		// try
		console.log(func, param); 
		return func.call(this, param);
	    // catch
	}
	return wrapper;
};

var loadAromWithCheck = function (func) {
	var loader = function (param) {
		m = func.call(this,param);
		m.aromatize();
		return m;
	}
	return loadWithCheck(loader);
}

var lmol = loadWithCheck(indigo.loadMolecule).bind(indigo);
var lsmarts = loadWithCheck(indigo.loadSmarts).bind(indigo);
var lqmol = loadAromWithCheck(indigo.loadQueryMolecule).bind(indigo);
var lmolf = loadWithCheck(indigo.loadMoleculeFromFile).bind(indigo);
var lqmolf = loadAromWithCheck(indigo.loadQueryMoleculeFromFile).bind(indigo);
tests = [
	[lmol('c'), lsmarts("[#1]")],
	[lmol('C'), lsmarts("[#1]")],
	[lmol('c1cc2cc3ccc4cc5cc6cccc7cc8ccc9cc%10cc(c1)c2c1c3c4c2c5c(c67)c8c9c2c%101'), lqmol("*~*~*~*~*~*~*~*~*~*~*~*~*~*~*")],
	[lmol('c1cc2cc3ccc4cc5cc6cccc7cc8ccc9cc%10cc(c1)c2c1c3c4c2c5c(c67)c8c9c2c%101'), lqmol("*~*~*~*~*~*~*~*~*~*~*~*1~*~*~*C=C1")],
	[lmol('c1cc2cc3ccc4cc5cc6cccc7cc8ccc9cc%10cc(c1)c2c1c3c4c2c5c(c67)c8c9c2c%101'), lqmol("*~*~*~*~*~*~*~*~*~*~*~*~1~*~*~*~*~*~1")],
	[lmol('c1cc2cc3ccc4cc5cc6cccc7cc8ccc9cc%10cc(c1)c2c1c3c4c2c5c(c67)c8c9c2c%101'), lsmarts("*~*~*~*~*~*~*~*~*~*~*~[#1,#6]")],
	[lmol('c1cc2concc2cn1'), lqmolf(local("../indigo-node/molecules/r1_2ap.mol"))],
	[lmol('c1cc2cnocc2cn1'), lqmolf(local("../indigo-node/molecules/r1_2ap_aal.mol"))],
	[lmolf(local("../indigo-node/molecules/r2_target.mol")), lqmolf(local("../indigo-node/molecules/r2.mol"))],
	[lmol('c1ccccc1'), lsmarts("[#6]cccc[#6,#7]")],
	[lmol('c1ccccc1'), lqmolf(local("../indigo-node/molecules/q_rg_recurs.mol"))],
	[lmol('c1ccccc1.c1ccccc1'), lqmolf(local("../indigo-node/molecules/q_rg_recurs.mol"))],
	[lmol('c1ccccc1'), lqmolf(local("../indigo-node/molecules/q_rg_recurs2.mol"))],
	[lmol('C1CCCCCC1'), lqmolf(local("../indigo-node/molecules/q_rg_recurs2.mol"))],
	[lmol('C1CCCCCC1.C1CCCCCC1'), lqmolf(local("../indigo-node/molecules/q_rg_recurs2.mol"))],
	[lmol('OC(=O)C1=CC=CC=C1'), lqmolf(local("../indigo-node/molecules/rgroups/c11100_3.mol"))],
	[lmol('N'), lsmarts("N-[#1,#112]")],
	[lmol('N'), lsmarts("N-[#1]")]
];

for (var i in tests) {
	console.log("*** Test %d ***", i)
	mol_q = tests[i];
	if (mol_q[0] && mol_q[1])
		FullTest(mol_q[0], mol_q[1]);
}

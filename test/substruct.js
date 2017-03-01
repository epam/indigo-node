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
var test = require('tap').test;

var path = require('path');
var fs = require('fs');
var local = path.join.bind(path, __dirname);

var Indigo = require("../indigo").Indigo;
var indigo = new Indigo();
var lyopset = {
    "embedding-uniqueness": ["atoms", "bonds", "none"],
    "midle": [6, 7],
    "max-embeddings": [20, 0, 1, 5, 500, 10000, 50000],
    "*embeddings limit*": [0, 200],
    "last": 3,
    "lalast": 5
};

var createVolume = function (obj, level) {
    var lev = level || 0;
    var pro = Object.create(obj);
    var obj_n = Object.assign(pro, obj);
    for (var key in obj) {
        delete obj_n[key];

        var iter = (Array.isArray(obj[key])) ? obj[key] : [obj[key]];
        if (Object.getOwnPropertyNames(obj_n).length) {
            var ret = createVolume(obj_n, lev + 1);
            for (var arr of iter) {
                for (var el of ret.value) {
                    if (!ret.level) {
                        ret.array.push([[key, arr], [ret.key, el]]);
                        //	console.log([[key, arr],[ret.key, el]]);
                    } else {
                        ret.array.push([[key, arr]].concat(el));
                        //	console.log([[key, arr]].concat(el));
                    }
                }
            }
            if (lev)
                return {key: key, value: ret.array, array: [], level: 1};
            else
                return ret.array;
        }
        else {
            return {key: key, value: iter, array: [], level: 0};
        }
    }
};

test('CreateVolume', function (t) {
    // console.log('\n#### - Substruct test - ####\n');
    t.plan(1);
    t.doesNotThrow(() => createVolume(lyopset), Array, 'check create volume');
});

test('Substructure with either and bidirectional mode', function (t) {
    t.plan(12);
    var checkHasMatchMol = function (indigo, m, q) {
        q.aromatize();
        m.checkBadValence();
        m.checkBadValence();
        var matcher = indigo.substructureMatcher(m);
        t.notEqual(matcher.match(q), null, 'check after substructureMatcher');

        var m2 = indigo.unserialize(m.serialize());
        var matcher2 = indigo.substructureMatcher(m2);
        t.notEqual(matcher2.match(q), null, 'check after serialize');

        q.optimize();
        t.notEqual(matcher.match(q), null, 'check after optimize - 1');
        t.notEqual(matcher2.match(q), null, 'check after optimize - 2');
    };

    var checkHasMatch = function (indigo, targetName, queryName) {
        var q = indigo.loadQueryMoleculeFromFile(local("fixtures/" + queryName));
        var m = indigo.loadMoleculeFromFile(local("fixtures/" + targetName));
        checkHasMatchMol(indigo, m, q);
    };

    indigo.setOption("stereochemistry-bidirectional-mode", true);
    checkHasMatch(indigo, "either1.mol", "either1.mol");
    checkHasMatch(indigo, "either1.mol", "either2.mol");
    checkHasMatch(indigo, "either1.mol", "either1_query.mol");
});

test('substructureMatcher test', function (t) {
    t.plan(1);
    var mol = indigo.loadMolecule('C1C=CC=CC=1');
    mol.aromatize();
    var q = indigo.loadQueryMolecule("C:C:C");
    var m = indigo.substructureMatcher(mol).match(q);

    t.notEqual(m, null, 'check for Null');
});

var FullTest = function (mol, q) {
    var matcher = indigo.substructureMatcher(mol);
    var cnt = matcher.countMatches(q);

    var testUnmappedAtoms = function (q, match, t) {
        var unmapped = 0;
        for (var atom of q.iterateAtoms()) {
            var mapped = match.mapAtom(atom);
            if (mapped == null)
                unmapped += 1;
            else
                mapped.index();
        }
    };
    var testEmbeddingCount = function (matcher, q, t, emb_limit) {
        var cnt = matcher.countMatches(q);
        var cnt2 = 0;
        for (m of matcher.iterateMatches(q)) {
            cnt2 += 1;
            if (cnt2 < 4)
                testUnmappedAtoms(q, m, t);
        }
        if (cnt != -1 && cnt2 != cnt) {
            throw Error("countMatches(q) != len(iterateMatches(q); cnt2 != cnt: " + cnt + " != " + cnt2);
        }
        var cnt3 = matcher.countMatchesWithLimit(q, emb_limit);
        if (emb_limit != 0 && cnt3 > emb_limit) {
            throw Error("cnt3 > emb_limit: " + cnt3 + " != " + emb_limit);
        }
    };
    var opset = {
        "embedding-uniqueness": ["atoms", "bonds", "none"],
        "max-embeddings": [20, 0, 1, 5, 500, 10000, 50000],
        "*embeddings limit*": [0, 200]
    };

    var opt_combintations = createVolume(opset);

    for (var opt_set of opt_combintations) {
        var emb_limit = -1;
        for (var opt_tuple of opt_set) {
            if (opt_tuple[0] != '*embeddings limit*')
                indigo.setOption(opt_tuple[0], opt_tuple[1]);
            else
                emb_limit = opt_tuple[1];
        }
        testEmbeddingCount(matcher, q, mol, emb_limit);
    }
};

var loadWithCheck = function (func) {
    return function (param) {
        // try
        return func.call(this, param);
        // catch
    };
};

var loadAromWithCheck = function (func) {
	var loader = function (param) {
		var m = func.call(this,param);
		m.aromatize();
		return m;
	};
	return loadWithCheck(loader);
};

test('FULL TEST', function (t) {
    var lmol = loadWithCheck(indigo.loadMolecule).bind(indigo);
    var lsmarts = loadWithCheck(indigo.loadSmarts).bind(indigo);
    var lqmol = loadAromWithCheck(indigo.loadQueryMolecule).bind(indigo);
    var lmolf = loadWithCheck(indigo.loadMoleculeFromFile).bind(indigo);
    var lqmolf = loadAromWithCheck(indigo.loadQueryMoleculeFromFile).bind(indigo);
    var tests = [
        [lmol('c'), lsmarts("[#1]")],
        [lmol('C'), lsmarts("[#1]")],
        [lmol('c1cc2cc3ccc4cc5cc6cccc7cc8ccc9cc%10cc(c1)c2c1c3c4c2c5c(c67)c8c9c2c%101'), lqmol("*~*~*~*~*~*~*~*~*~*~*~*~*~*~*")],
        [lmol('c1cc2cc3ccc4cc5cc6cccc7cc8ccc9cc%10cc(c1)c2c1c3c4c2c5c(c67)c8c9c2c%101'), lqmol("*~*~*~*~*~*~*~*~*~*~*~*1~*~*~*C=C1")],
        [lmol('c1cc2cc3ccc4cc5cc6cccc7cc8ccc9cc%10cc(c1)c2c1c3c4c2c5c(c67)c8c9c2c%101'), lqmol("*~*~*~*~*~*~*~*~*~*~*~*~1~*~*~*~*~*~1")],
        [lmol('c1cc2cc3ccc4cc5cc6cccc7cc8ccc9cc%10cc(c1)c2c1c3c4c2c5c(c67)c8c9c2c%101'), lsmarts("*~*~*~*~*~*~*~*~*~*~*~[#1,#6]")],
        [lmol('c1cc2concc2cn1'), lqmolf(local("fixtures/r1_2ap.mol"))],
        [lmol('c1cc2cnocc2cn1'), lqmolf(local("fixtures/r1_2ap_aal.mol"))],
        [lmolf(local("fixtures/r2_target.mol")), lqmolf(local("fixtures/r2.mol"))],
        [lmol('c1ccccc1'), lsmarts("[#6]cccc[#6,#7]")],
        [lmol('c1ccccc1'), lqmolf(local("fixtures/q_rg_recurs.mol"))],
        [lmol('c1ccccc1.c1ccccc1'), lqmolf(local("fixtures/q_rg_recurs.mol"))],
        [lmol('c1ccccc1'), lqmolf(local("fixtures/q_rg_recurs2.mol"))],
        [lmol('C1CCCCCC1'), lqmolf(local("fixtures/q_rg_recurs2.mol"))],
        [lmol('C1CCCCCC1.C1CCCCCC1'), lqmolf(local("fixtures/q_rg_recurs2.mol"))],
        [lmol('OC(=O)C1=CC=CC=C1'), lqmolf(local("fixtures/rgroup-c11100.mol"))],
        [lmol('N'), lsmarts("N-[#1,#112]")],
        [lmol('N'), lsmarts("N-[#1]")]
    ];

    t.plan(tests.length);

    for (var i in tests) {
        var mol_q = tests[i];
        t.doesNotThrow(() => {
            if (mol_q[0] && mol_q[1])
                FullTest(mol_q[0], mol_q[1]);
        });
    }
});

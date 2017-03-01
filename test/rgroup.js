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
var test = require('tape');

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var local = path.join.bind(path, __dirname);

var Indigo = require("../indigo").Indigo;
var indigo = new Indigo();

indigo.setOption("treat-x-as-pseudoatom", true);
indigo.setOption("ignore-stereochemistry-errors", true);

test('testRsite', function (t) {
    // console.log('\n#### - Rgroup test - ####\n');
	t.plan(1);
    var query = indigo.loadQueryMolecule("[OH]C1C([OH])C([*:1])OC([*:2])C1[OH]");
    for (var rsite of query.iterateRSites()) {
        rsite.removeConstraints("rsite");
        rsite.addConstraint("atomic-number", "12");
    }
    t.equal(query.smiles(), '[OH]C1C([OH])C([Mg])OC([Mg])C1[OH]');
});

test('testRGroupDecomposition', function (t) {
	t.plan(1);
	t.doesNotThrow(() => {
        var query = indigo.loadQueryMolecule("[OH]C1C([OH])C([*:1])OC([*:2])C1[OH]");
        for (var rsite of query.iterateRSites()) {
            rsite.removeConstraints("rsite");
            rsite.addConstraintNot("atomic-number", "1");
        }
        for (var structure of indigo.iterateSDFile(local("fixtures/sugars.sdf.gz"))) {
            var id = structure.getProperty("molregno");
            var match = indigo.substructureMatcher(structure).match(query);
            if (!match)
                continue;

            var to_remove = [];
            var mapped_rsites = [];
            for (var qatom of query.iterateAtoms()) {
                var tatom = match.mapAtom(qatom);
                if (qatom.atomicNumber() == 0) {
                    tatom.setAttachmentPoint(1);
                    mapped_rsites.push(tatom);
                } else
                    to_remove.push(tatom.index());
            }
            structure.removeAtoms(to_remove);
            for (var tatom of mapped_rsites) {
                if (structure.component(tatom.componentIndex()).clone().smiles() == '')
                	throw Error("!");
            }
        }
	});
});

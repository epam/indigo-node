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
let test = require('tape');

let assert = require('assert');
let path = require('path');
let fs = require('fs');
let local = path.join.bind(path, __dirname);

let Indigo = require("../indigo").Indigo;
let indigo = new Indigo();

indigo.setOption("treat-x-as-pseudoatom", true);
indigo.setOption("ignore-stereochemistry-errors", true);

test('testRsite', function (t) {
    console.log('\n#### - Rgroup test - ####\n');
	t.plan(1);
    let query = indigo.loadQueryMolecule("[OH]C1C([OH])C([*:1])OC([*:2])C1[OH]");
    for (let rsite of query.iterateRSites()) {
        rsite.removeConstraints("rsite");
        rsite.addConstraint("atomic-number", "12");
    }
    t.equal(query.smiles(), '[OH]C1C([OH])C([Mg])OC([Mg])C1[OH]');
});

test('testRGroupDecomposition', function (t) {
	t.plan(1);
	t.doesNotThrow(() => {
        let query = indigo.loadQueryMolecule("[OH]C1C([OH])C([*:1])OC([*:2])C1[OH]");
        for (let rsite of query.iterateRSites()) {
            rsite.removeConstraints("rsite");
            rsite.addConstraintNot("atomic-number", "1");
        }
        for (let structure of indigo.iterateSDFile(local("fixtures/sugars.sdf.gz"))) {
            let id = structure.getProperty("molregno");
            let match = indigo.substructureMatcher(structure).match(query);
            if (!match)
                continue;

            let to_remove = [];
            let mapped_rsites = [];
            for (let qatom of query.iterateAtoms()) {
                let tatom = match.mapAtom(qatom);
                if (qatom.atomicNumber() == 0) {
                    tatom.setAttachmentPoint(1);
                    mapped_rsites.push(tatom);
                } else
                    to_remove.push(tatom.index());
            }
            structure.removeAtoms(to_remove);
            for (let tatom of mapped_rsites) {
                if (structure.component(tatom.componentIndex()).clone().smiles() == '')
                	throw Error("!");
            }
        }
	})
});

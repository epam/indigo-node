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
let tmp = require('tmp');

let assert = require('assert');
let path = require('path');
let fs = require('fs');
let local = path.join.bind(path, __dirname);

let Indigo = require("../indigo").Indigo;
let indigo = new Indigo();

let tmpDir = tmp.dirSync({ template: local('/tmp-XXXXXX'), unsafeCleanup: true });

let readSdfAndPrintInfo = function (fname) {
    for (let m of indigo.iterateSDFile(local(fname))) {
        m.smiles();
        m.molfile();
        m.rawData();
        for (let prop of m.iterateProperties())
            prop.rawData();
    }
};

test('Read SDF.GZ', function (t) {
    console.log('\n#### - CDF test - ####\n');
    t.plan(1);
	t.throws(() => readSdfAndPrintInfo('fixtures/sugars.sdf.gz'), null);
});

let names = [];
for (let i = 0; i < 10; i++) {
    names.push(i.toString());
    names.push("Name"+ i);
    names.push("Much longer name"+ i);
}

let checkMolNames = function (/*test*/t, sdf_file_name) {
    let i = 0;
    for (let m of indigo.iterateSDFile(sdf_file_name)) {
        t.equals(m.name(), names[i], 'Names should be the same');
        i++;
    }
};

test('Save and load molecule names from SDF', function (t) {
	t.plan(30);

    let sdf_file_name = tmpDir.name +"/sdf-names.sdf";
    let saver = indigo.createFileSaver(sdf_file_name, "sdf");

    for (let name of names) {
        let m = indigo.createMolecule();
        m.setName(name);
        saver.append(m);
    }
    saver.close();
    checkMolNames(t, sdf_file_name);
});

test('Use sdfAppend', function (t) {
    t.plan(30);

    let sdf_file_name = tmpDir.name + "/sdf-names-2.sdf";
    let sdf = indigo.writeFile(sdf_file_name);

    for (let name of names) {
        let m = indigo.createMolecule();
        m.setName(name);
        sdf.sdfAppend(m)
    }
    sdf.close();
    checkMolNames(t, sdf_file_name);
});

test('Read SDF with invalid header', function (t) {
	t.plan(1);
	t.equals(readSdfAndPrintInfo('fixtures/bad-header.sdf'), undefined, 'should be undefined');
});

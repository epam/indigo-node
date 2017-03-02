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
var tmp = require('tmp');

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var local = path.join.bind(path, __dirname);

var Indigo = require("../indigo").Indigo;
var indigo = new Indigo();

var tmpDir = tmp.dirSync({ unsafeCleanup: true });

var readSdfAndPrintInfo = function (fname) {
    for (var m of indigo.iterateSDFile(local(fname))) {
        m.smiles();
        m.molfile();
        m.rawData();
        for (var prop of m.iterateProperties())
            prop.rawData();
    }
};

test('Read SDF.GZ', function (t) {
    // console.log('\n#### - CDF test - ####\n');
    t.plan(1);
	t.throws(() => readSdfAndPrintInfo('fixtures/sugars.sdf.gz'), null);
});

var names = [];
for (var i = 0; i < 10; i++) {
    names.push(i.toString());
    names.push("Name"+ i);
    names.push("Much longer name"+ i);
}

var checkMolNames = function (/*test*/t, sdf_file_name) {
    var i = 0;
    for (var m of indigo.iterateSDFile(sdf_file_name)) {
        t.equals(m.name(), names[i], 'Names should be the same');
        i++;
    }
};

test('Save and load molecule names from SDF', function (t) {
	t.plan(30);

    var sdf_file_name = tmpDir.name +"/sdf-names.sdf";
    var saver = indigo.createFileSaver(sdf_file_name, "sdf");

    for (var name of names) {
        var m = indigo.createMolecule();
        m.setName(name);
        saver.append(m);
    }
    saver.close();
    checkMolNames(t, sdf_file_name);
});

test('Use sdfAppend', function (t) {
    t.plan(30);

    var sdf_file_name = tmpDir.name + "/sdf-names-2.sdf";
    var sdf = indigo.writeFile(sdf_file_name);

    for (var name of names) {
        var m = indigo.createMolecule();
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

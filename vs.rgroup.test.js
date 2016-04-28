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

var indigo = require("../indigo-node/indigo");
indigo.setOption("treat-x-as-pseudoatom", true)
indigo.setOption("ignore-stereochemistry-errors", true)

var testRSite = function () {
	var query = indigo.loadQueryMolecule("[OH]C1C([OH])C([*:1])OC([*:2])C1[OH]");
	console.log(query.smiles());
	for (var rsite of query.iterateRSites())
	{
		rsite.removeConstraints("rsite");
		rsite.addConstraint("atomic-number", "12");
	}
	console.log(query.smiles());
}

var testRGroupDecomposition = function () {
	var query = indigo.loadQueryMolecule("[OH]C1C([OH])C([*:1])OC([*:2])C1[OH]");
	for (var rsite of query.iterateRSites())
	{
		rsite.removeConstraints("rsite");
		rsite.addConstraintNot("atomic-number", "1");
	}
	for (var structure of indigo.iterateSDFile(local("../indigo-node/molecules/sugars.sdf")))
	{
		var id = structure.getProperty("molregno");
		var match = indigo.substructureMatcher(structure).match(query);
		if (!match) {
			console.log(id + ' not matched');
			continue;
		}
		console.log(structure.smiles());
		var to_remove = [];
		var mapped_rsites = [];
		for (var qatom of query.iterateAtoms())
		{
			var tatom = match.mapAtom(qatom)
			if (qatom.atomicNumber() == 0) {
				tatom.setAttachmentPoint(1);
				mapped_rsites.push(tatom);
			} else
				to_remove.push(tatom.index());
		}
		structure.removeAtoms(to_remove);
		for (tatom of mapped_rsites)
		{
			console.log( id + ' RGROUP:');
			console.log(structure.component(tatom.componentIndex()).clone().smiles());
		}
	}
}

testRSite();
testRGroupDecomposition();
	

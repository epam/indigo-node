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

testRSite();
	

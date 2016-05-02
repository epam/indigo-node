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

var componentSmiles = function (mol) {
	if (mol.countComponents() > 1) {
		items = [];
		for (var comp of mol.iterateComponents())
		{
			var item = comp.clone().canonicalSmiles();
			var ext = item.search(" |");
			if (ext > 0) item = item.substring(0,ext);
			items.push(item);
		}
		return items.sort().join('.')
	}
	return mol.canonicalSmiles()
}

var testCanonical = function () {
	for(var m of indigo.iterateSDFile(local("../indigo-node/molecules/test.sdf")))
		console.log(componentSmiles(m));
}
testCanonical();

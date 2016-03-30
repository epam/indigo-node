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
var path = require("path");
var local = path.join.bind(path, __dirname);
var config = require(local("configureIndigo"));
var libs_api = require(local("indigo-api"));
var ffi = require('ffi');


var Indigo = function (options) {
	options = options || {};
	var libpath = local('shared/' + process.platform + '/' + process.arch + '/indigo');
	this.libpath = options.libpath || libpath;
	this._lib = ffi.Library(libpath, libs_api);
};

/*
 * Return Indigo version string.
 * 
 * @method getVersion
 * @return {String} Indigo version
 */
Indigo.prototype.getVersion = function () {
	return "Indigo version(" + this._lib.indigoVersion() + ");";
}

module.exports = new Indigo();

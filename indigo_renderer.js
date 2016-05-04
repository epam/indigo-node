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
var path = require('path');
var local = path.join.bind(path, __dirname);
var config = require(local('configureIndigo'));
var lib_api = require(local('indigo-api'));
var IndigoObject = require(local('indigoObject'));
var Indigo = require(local('indigo'));

var ffi = require('ffi');

var IndigoRenderer = function (indigo, options) {
	options = options || {};
	var libpath = local('shared/' + process.platform + '/' + process.arch + '/'+ config[process.platform].libs['indigo-renderer']);
	this.libpath = options.libpath || libpath;
	this.exception = options.exception || false;
	this.logger = options.logger || console;
	this._lib = ffi.Library(libpath, lib_api.api_render);
	if (indigo instanceof Indigo) {
		this.indigo = indigo;
	} else {
		if (this.exception)
			throw new Indigo.IndigoException("indigo isn't an instance of Indigo");
		else
			this.logger.error("indigo isn't an instance of Indigo");
	}
};

/*
 * 
 * @method renderToBuffer
 * @param {object} obj is IndigoObject
 * @returns {Array}
 */
IndigoRenderer.prototype.renderToBuffer = function (obj) {
	this.indigo._setSessionId();
	var wb = this.indigo.writeBuffer();
	if (this.exception) {
		try {
			this.indigo._checkResult(this._lib.indigoRender(obj.id, wb.id));
			return wb.toBuffer();
		} finally {
			wb.dispose();
		}
	}
	else {
		this.indigo._checkResult(this._lib.indigoRender(obj.id, wb.id));
		var array = wb.toBuffer();
		wb.dispose();
		return array;
	}
};

/*
 * 
 * @method renderToFile
 * @param {object} obj is IndigoObject
 * @param {string} filename
 */
IndigoRenderer.prototype.renderToFile = function (obj, filename) {
	this.indigo._setSessionId();
	this.indigo._checkResult(this._lib.indigoRenderToFile(obj.id, filename));
};

module.exports = IndigoRenderer;


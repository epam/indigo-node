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

var IndigoRenderer = function (indigo, options) {
	options = options || {};
	var libpath = local('shared/' + process.platform + '/' + process.arch + '/'+ config[process.platform].libs['indigo-renderer']);
	this.libpath = options.libpath || libpath;
	this.exception = options.exception || false;
	this.logger = options.logger || console;
	this._lib = lib_api.Library(libpath, lib_api.api_render);
	if (indigo instanceof Indigo) {
		this.indigo = indigo;
		if (this.exception)
			indigo.exception = this.exception;
		else 
			this.exception= indigo.exception;
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
 * @return {boolean} return true if file have been saved successfully
 */
IndigoRenderer.prototype.renderToFile = function (obj, filename) {
	this.indigo._setSessionId();
	return (this.indigo._checkResult(this._lib.indigoRenderToFile(obj.id, filename)) == 1);
};

/*
 * 
 * @method renderReset
 * @return {boolean} return true if reset have been done successfully
 */
IndigoRenderer.prototype.renderReset = function () {
	this.indigo._setSessionId();
	return (this.indigo._checkResult(this._lib.indigoRenderReset()) == 1);
};

/*
 * 
 * @method renderGridToFile
 * @param {object} objects  is an array of molecules created with indigoCreateArray
 * @param {array} refatoms is an array of integers, whose size must be equal to the number of molecules if the array
 * @param {number} ncolumns is the number of columns in the grid
 * @param {string} filename
 */
IndigoRenderer.prototype.renderGridToFile = function (objects, refatoms, ncolumns, filename) {
	this.indigo._setSessionId();
	var arr = null;
	if (refatoms) {
		if (refatoms.length != objects.count()) {
			if (this.exception) {
				throw new Error("renderGridToFile(): refatoms[] size must be equal to the number of objects");
			}
			else
				return [];
		}
		arr = refatoms;
	}
	this.indigo._checkResult(this._lib.indigoRenderGridToFile(objects.id, arr, ncolumns, filename));
};

/*
 * 
 * @method renderGridToBuffer
 * @param {object} objects  is an array of molecules created with indigoCreateArray
 * @param {array} refatoms is an array of integers, whose size must be equal to the number of molecules if the array
 * @param {number} ncolumns is the number of columns in the grid
 */
IndigoRenderer.prototype.renderGridToBuffer = function (objects, refatoms, ncolumns, filename) {
	this.indigo._setSessionId();
	var arr = null;
	if (refatoms) {
		if (refatoms.length != objects.count()) {
			if (this.exception) {
				throw new Error("renderGridToBuffer(): refatoms[] size must be equal to the number of objects");
			}
			else
				return [];
		}
		arr = refatoms;
	}
	var wb = this.indigo.writeBuffer();
	if (this.exception) {
		try {
			this.indigo._checkResult(this._lib.indigoRenderGrid(objects.id, arr, ncolumns, wb.id));
			return wb.toBuffer();
		} finally {
			wb.dispose();
		}
	}
	else {
		this.indigo._checkResult(this._lib.indigoRenderGrid(objects.id, arr, ncolumns, wb.id));
		var array = wb.toBuffer();
		wb.dispose();
		return array;
	}
};

module.exports = IndigoRenderer;


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

var ffi = require('ffi');
var refArray = require('ref-array');

var IndigoObject = require('./indigoObject');
var IndigoException = require('./indigoException');
var Indigo = require('./indigo');

var IndigoRenderer = function (indigo) {
	this.indigo = indigo;
	var libpath = path.join(indigo.dllpath,
	                        process.platform != 'win32' ? 'libindigo-renderer' : 'indigo-renderer');

	this._lib = ffi.Library(libpath, {
		"indigoRender": ["int", ["int", "int"]],
		"indigoRenderToFile": ["int", ["int", "string"]],
		"indigoRenderGrid": ["int", ["int", refArray('int'), "int", "int"]],
		"indigoRenderGridToFile": ["int", ["int", refArray('int'), "int", "string"]],
		"indigoRenderReset": ["int", []]
	});
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
	try {
		this.indigo._checkResult(this._lib.indigoRender(obj.id, wb.id));
		return wb.toBuffer();
	} finally {
		wb.dispose();
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
		if (refatoms.length != objects.count())
			throw new IndigoException("renderGridToFile(): refatoms[] size must be equal to the number of objects");
		// TODO: check python conformance
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
		if (refatoms.length != objects.count())
			throw new IndigoException("renderGridToBuffer(): refatoms[] size must be equal to the number of objects");

		// TODO: check python conformance
		arr = refatoms;
	}
	var wb = this.indigo.writeBuffer();

	try {
		this.indigo._checkResult(this._lib.indigoRenderGrid(objects.id, arr, ncolumns, wb.id));
		return wb.toBuffer();
	} finally {
		wb.dispose();
	}
};

module.exports = IndigoRenderer;

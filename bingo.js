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
var ref = require('ref');

var IndigoObject = require('./indigoObject');
var IndigoException = require('./indigoException');
var BingoObject = require('./bingoObject');
var Indigo = require('./indigo');

var Bingo = function (bingoId, indigo, lib) {
	this.id = bingoId;
	this._lib = lib;
	this.indigo = indigo;
};

Bingo._getLib = function (indigo) {
	var libpath = path.join(indigo.dllpath,
	                        process.platform != 'win32' ? 'libbingo' : 'bingo');

	return ffi.Library(libpath, {
		"bingoVersion": ["string", []], // options = "id: <property-name>"
		"bingoCreateDatabaseFile": ["int", ["string", "string", "string"]],
		"bingoLoadDatabaseFile": ["int", ["string", "string"]],
		"bingoCloseDatabase": ["int", ["int"]],
		// Record insertion/deletion
		"bingoInsertRecordObj": ["int", ["int", "int"]],
		"bingoInsertRecordObjWithId": ["int", ["int", "int", "int"]],
		"bingoDeleteRecord": ["int", ["int", "int"]],
		"bingoGetRecordObj": ["int", ["int", "int"]],
		"bingoOptimize": ["int", ["int"]],
		// Search methods that returns search object
		// Search object is an iterator
		"bingoSearchSub": ["int", ["int", "int", "string"]],
		"bingoSearchExact": ["int", ["int", "int", "string"]],
		"bingoSearchMolFormula": ["int", ["int", "string", "string"]],
		"bingoSearchSim": ["int", ["int", "int", "float", "float", "string"]],
		// Search object methods
		"bingoNext": ["int", ["int"]],
		"bingoGetCurrentId": ["int", ["int"]],
		"bingoGetCurrentSimilarityValue": ["float", ["int"]],
		// Estimation methods
		"bingoEstimateRemainingResultsCount": ["int", ["int"]],
		"bingoEstimateRemainingResultsCountError": ["int", ["int"]],
		"bingoEstimateRemainingTime": ["int", ["int", ref.refType('float')]],
		// This method return IndigoObject that represents current object.
		// After calling bingoNext this object automatically points to the next found result
		"bingoGetObject": ["int", ["int"]],
		"bingoEndSearch": ["int", ["int"]]
	});
};
/*
 *
 * @method Bingo.createDatabaseFile
 * @return {object} Bingo
 */
Bingo.createDatabaseFile = function (indigo, path, databaseType, options) {
	options = options || '';
	indigo._setSessionId();
	var lib = Bingo._getLib(indigo);
	return new Bingo(indigo._checkResult(lib.bingoCreateDatabaseFile(path, databaseType, options)), indigo, lib);
};

/*
 *
 * @method Bingo.loadDatabaseFile
 * @return {object} Bingo
 */
Bingo.loadDatabaseFile = function (indigo, path, options) {
	options = options || '';
	indigo._setSessionId();
	var lib = Bingo._getLib(indigo);
	return new Bingo(indigo._checkResult(lib.bingoLoadDatabaseFile(path, options)), indigo, lib);
};

/*
 *
 * @method close
 * @return {string} string of version
 */
Bingo.prototype.close = function () {
	this.indigo._setSessionId();
	if (this.id >= 0)
		this.indigo._checkResult(this._lib.bingoCloseDatabase(this.id));
	this.id = -1;
};

/*
 *
 * @method version
 * @return {string} string of version
 */
Bingo.prototype.version = function () {
	this.indigo._setSessionId();
	return this._lib.bingoVersion();
};

/*
 *
 * @method insert
 * @return {number}
 */
Bingo.prototype.insert = function (indigoObject, index) {
	this.indigo._setSessionId();
	if (index === undefined)
		return this.indigo._checkResult(this._lib.bingoInsertRecordObj(this.id, indigoObject.id));
	else
		return this.indigo._checkResult(this._lib.bingoInsertRecordObjWithId(this.id, indigoObject.id, index));

};

/*
 *
 * @method delete
 * @return {number}
 */
Bingo.prototype.delete = function (index) {
	this.indigo._setSessionId();
	return this.indigo._checkResult(this._lib.bingoDeleteRecord(this.id, index));
};

/*
 *
 * @method searchSub
 * @return {number}
 */
Bingo.prototype.searchSub = function (query, options) {
	options = options || '';
	this.indigo._setSessionId();
	return new BingoObject(this.indigo._checkResult(this._lib.bingoSearchSub(this.id, query.id, options)), this.indigo, this);
};

/*
 *
 * @method searchExact
 * @return {number}
 */
Bingo.prototype.searchExact = function (query, options) {
	options = options || '';
	this.indigo._setSessionId();
	return new BingoObject(this.indigo._checkResult(this._lib.bingoSearchExact(this.id, query.id, options)), this.indigo, this);
};

/*
 *
 * @method searchSim
 * @return {number}
 */
Bingo.prototype.searchSim = function (query, minSim, maxSim, metric) {
	metric = metric || 'tanimoto';
	this.indigo._setSessionId();
	return new BingoObject(this.indigo._checkResult(this._lib.bingoSearchSim(this.id, query.id, minSim, maxSim, metric)), this.indigo, this);
};

/*
 *
 * @method searchMolFormula
 * @return {number}
 */
Bingo.prototype.searchMolFormula = function (query, options) {
	options = options || '';
	this.indigo._setSessionId();
	return new BingoObject(this.indigo._checkResult(this._lib.bingoSearchMolFormula(this.id, query, options)), this.indigo, this);
};

/*
 *
 * @method optimize
 * @return {boolean} true if optimization have been done successfully
 */
Bingo.prototype.optimize = function () {
	this.indigo._setSessionId();
	return (this._lib.bingoOptimize(this.id) == 0);
};

/*
 *
 * @method getRecordById
 * @return {object}
 */
Bingo.prototype.getRecordById = function (index) {
	this.indigo._setSessionId();
	return new IndigoObject(this.indigo, this.indigo._checkResult(this._lib.bingoGetRecordObj(this.id, index)));
};

module.exports = Bingo;

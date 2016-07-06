/****************************************************************************
 * Copyright (C) 2015-2016 EPAM Systems
 *
 * This file is part of Indigo-Node binding.
G *
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

var indigo = require('./indigo');

var BingoException = function (message) {
	this.message = message;
	this.name = "BingoException";
	this.stack = (new Error).stack;
};

BingoException.prototype = new Error;

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


Bingo._checkResult = function (indigo, result) {
	if (result < 0)
		throw new BingoException(indigo.getLastError());
	return result;
};

Bingo._checkResultString = function (indigo, result) {
	if (typeof result !== 'string')
		throw new BingoException(indigo.getLastError());
	return result;
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
	return new Bingo(Bingo._checkResult(indigo, lib.bingoCreateDatabaseFile(path, databaseType, options)), indigo, lib);
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
	return new Bingo(Bingo._checkResult(indigo, lib.bingoLoadDatabaseFile(path, options)), indigo, lib);
};

Bingo.prototype.close = function () {
	this.indigo._setSessionId();
	if (this.id >= 0)
		Bingo._checkResult(this.indigo, this._lib.bingoCloseDatabase(this.id));
	this.id = -1;
};

/*
 *
 * @method version
 * @return {string} string of version
 */
Bingo.prototype.version = function () {
	this.indigo._setSessionId();
	return Bingo._checkResultString(this.indigo, this._lib.bingoVersion());
};

/*
 *
 * @method insert
 * @return {number}
 */
Bingo.prototype.insert = function (indigoObject, index) {
	this.indigo._setSessionId();
	if (index === undefined)
		return Bingo._checkResult(this.indigo, this._lib.bingoInsertRecordObj(this.id, indigoObject.id));
	else
		return Bingo._checkResult(this.indigo, this._lib.bingoInsertRecordObjWithId(this.id, indigoObject.id, index));

};

/*
 *
 * @method delete
 * @return {number}
 */
Bingo.prototype.delete = function (index) {
	this.indigo._setSessionId();
	return Bingo._checkResult(this.indigo, this._lib.bingoDeleteRecord(this.id, index));
};

/*
 *
 * @method searchSub
 * @return {number}
 */
Bingo.prototype.searchSub = function (query, options) {
	options = options || '';
	this.indigo._setSessionId();
	return new BingoObject(Bingo._checkResult(this.indigo, this._lib.bingoSearchSub(this.id, query.id, options)), this.indigo, this);
};

/*
 *
 * @method searchExact
 * @return {number}
 */
Bingo.prototype.searchExact = function (query, options) {
	options = options || '';
	this.indigo._setSessionId();
	return new BingoObject(Bingo._checkResult(this.indigo, this._lib.bingoSearchExact(this.id, query.id, options)), this.indigo, this);
};

/*
 *
 * @method searchSim
 * @return {number}
 */
Bingo.prototype.searchSim = function (query, minSim, maxSim, metric) {
	metric = metric || 'tanimoto';
	this.indigo._setSessionId();
	return new BingoObject(Bingo._checkResult(this.indigo, this._lib.bingoSearchSim(this.id, query.id, minSim, maxSim, metric)), this.indigo, this);
};

/*
 *
 * @method searchMolFormula
 * @return {number}
 */
Bingo.prototype.searchMolFormula = function (query, options) {
	options = options || '';
	this.indigo._setSessionId();
	return new BingoObject(Bingo._checkResult(this.indigo, this._lib.bingoSearchMolFormula(this.id, query, options)), this.indigo, this);
};

/*
 *
 * @method optimize
 * @return {boolean} true if optimization have been done successfully
 */
Bingo.prototype.optimize = function () {
	this.indigo._setSessionId();
	return Bingo._checkResult(this.indigo, this._lib.bingoOptimize(this.id));
};

/*
 *
 * @method getRecordById
 * @return {object}
 */
Bingo.prototype.getRecordById = function (id) {
	this.indigo._setSessionId();
	return new indigo.IndigoObject(this.indigo, Bingo._checkResult(this.indigo, this._lib.bingoGetRecordObj(this.id, id)));
};

var BingoObject = function (id, indigo, bingo) {
	this.id = id;
	this.indigo = indigo;
	this.bingo = bingo;
};

/*
 * Close an object
 *
 * @method close
 * @returns {number}
 */
BingoObject.prototype.close = function () {
	this.indigo._setSessionId();
	var res;
	if (this.id >= 0) {
		res = Bingo._checkResult(this.indigo, this.bingo._lib.bingoEndSearch(this.id));
		this.id = -1;
	}
	return true;
};


/*
 * next
 *
 * @method next
 * @returns {boolean}
 */
BingoObject.prototype.next = function () {
	this.indigo._setSessionId();
	return (Bingo._checkResult(this.indigo, this.bingo._lib.bingoNext(this.id)) == 1);
};

/*
 * next
 *
 * @method getCurrentId
 * @returns {number} id
 */
BingoObject.prototype.getCurrentId = function () {
	this.indigo._setSessionId();
	return Bingo._checkResult(this.indigo, this.bingo._lib.bingoGetCurrentId(this.id));
};

/*
 *
 * @method getIndigoObject
 * @returns {object} IndigoObject
 */
BingoObject.prototype.getIndigoObject = function () {
	this.indigo._setSessionId();
	return new indigo.IndigoObject(this.indigo, Bingo._checkResult(this.indigo, this.bingo._lib.bingoGetObject(this.id)));
};

/*
 *
 * @method getCurrentSimilarityValue
 * @returns {number}
 */
BingoObject.prototype.getCurrentSimilarityValue = function () {
	this.indigo._setSessionId();
	return Bingo._checkResult(this.indigo, this.bingo._lib.bingoGetCurrentSimilarityValue(this.id));
};

/*
 *
 * @method estimateRemainingResultsCount
 * @returns {number}
 */
BingoObject.prototype.estimateRemainingResultsCount = function () {
	this.indigo._setSessionId();
	return Bingo._checkResult(this.indigo, this.bingo._lib.bingoEstimateRemainingResultsCount(this.id));
};

/*
 *
 * @method estimateRemainingResultsCountError
 * @returns {number}
 */
BingoObject.prototype.estimateRemainingResultsCountError = function () {
	this.indigo._setSessionId();
	return Bingo._checkResult(this.indigo, this.bingo._lib.bingoEstimateRemainingResultsCountError(this.id));
};

/*
 *
 * @method estimateRemainingTime
 * @returns {number}
 */
BingoObject.prototype.estimateRemainingTime = function () {
	this.indigo._setSessionId();
	var value = ref.alloc('float');
	Bingo._checkResult(this.indigo, this.bingo._lib.bingoEstimateRemainingTime(this.id, value));
	return value.deref();
};

module.exports = {
	Bingo: Bingo,
	BingoObject: BingoObject,
	BingoException: BingoException
};

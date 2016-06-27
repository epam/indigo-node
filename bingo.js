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
var config = require('./configureIndigo');
var lib_api = require('./indigo-api');
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
	var libpath = path.join(indigo.dllpath, config[process.platform].libs['bingo']);

	return lib_api.Library(libpath, lib_api.api_bingo);
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

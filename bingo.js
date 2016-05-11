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
var BingoObject = require(local('bingoObject'));
var Indigo = require(local('indigo'));

var Bingo = function (bingoId, indigo, options) {
	options = options || {};
	this.id = bingoId;
	this.libpath = options.libpath;
	this.exception = options.exception || false;
	this.logger = options.logger || console;
	this._lib = options.lib;
	if (indigo instanceof Indigo) {
		this.indigo = indigo;
		if (this.exception)
			indigo.exception = this.exception;
		else
			this.exception = indigo.exception;
	} else {
		if (this.exception)
			throw new Indigo.IndigoException("indigo isn't an instance of Indigo");
		else
			this.logger.error("indigo isn't an instance of Indigo");
	}
};

/*
 * 
 * @method Bingo.createDatabaseFile
 * @return {object} Bingo
 */
Bingo.createDatabaseFile = function (indigo, path, databaseType, opt) {
	opt = opt || {};
	indigo._setSessionId();
	var libpath = local('shared/' + process.platform + '/' + process.arch + '/' + config[process.platform].libs['bingo']);
	opt.libpath = opt.libpath || libpath;
	opt.options = opt.options || '';
	opt.lib = lib_api.Library(opt.libpath, lib_api.api_bingo);
	return new Bingo(indigo._checkResult(opt.lib.bingoCreateDatabaseFile(path, databaseType, opt.options)), indigo, opt);
};

/*
 * 
 * @method Bingo.loadDatabaseFile
 * @return {object} Bingo
 */
Bingo.loadDatabaseFile = function (indigo, path, opt) {
	opt = opt || {};
	indigo._setSessionId();
	var libpath = local('shared/' + process.platform + '/' + process.arch + '/' + config[process.platform].libs['bingo']);
	opt.libpath = opt.libpath || libpath;
	opt.options = opt.options || '';
	opt.lib = lib_api.Library(opt.libpath, lib_api.api_bingo);
	return new Bingo(indigo._checkResult(opt.lib.bingoLoadDatabaseFile(path, opt.options)), indigo, opt);
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


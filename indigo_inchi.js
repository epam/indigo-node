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
var Indigo = require('./indigo');

var IndigoInchi = function (indigo) {
	this.indigo = indigo;
	var libpath = path.join(indigo.dllpath, config[process.platform].libs['indigo-inchi']);

	this._lib = lib_api.Library(libpath, lib_api.api_inchi);
};

/*
 *
 * @method version
 * @return {string} string of version
 */
IndigoInchi.prototype.version = function () {
	this.indigo._setSessionId();
	return this._lib.indigoInchiVersion();
};

/*
 *
 * @method resetOptions
 * @return {boolean} return true if option applies as successful
 */
IndigoInchi.prototype.resetOptions = function () {
	this.indigo._setSessionId();
	return (this.indigo._checkResult(this._lib.indigoInchiResetOptions()) === 1);
};

/*
 *
 *
 * @method loadMolecule
 * @param {string}
 * @return {object} a new indigo object
 */
IndigoInchi.prototype.loadMolecule = function (inchi) {
	this.indigo._setSessionId();
	return new IndigoObject(this.indigo, this.indigo._checkResult(this._lib.indigoInchiLoadMolecule(inchi)));
};

/*
 *
 * @method getInchi
 * @param {object}
 * @return {string}
 */
IndigoInchi.prototype.getInchi = function (molecule) {
	this.indigo._setSessionId();
	return this.indigo._checkResultString(this._lib.indigoInchiGetInchi(molecule.id));
};

/*
 *
 * @method getWarning
 * @return {string}
 */
IndigoInchi.prototype.getWarning = function () {
	this.indigo._setSessionId();
	return this.indigo._checkResultString(this._lib.indigoInchiGetWarning());
};

/*
 *
 * @method getInchiKey
 * @return {string}
 */
IndigoInchi.prototype.getInchiKey = function (inchi) {
	this.indigo._setSessionId();
	return this.indigo._checkResultString(this._lib.indigoInchiGetInchiKey(inchi));
};

/*
 *
 * @method getLog
 * @return {string}
 */
IndigoInchi.prototype.getLog = function () {
	this.indigo._setSessionId();
	return this.indigo._checkResultString(this._lib.indigoInchiGetLog());
};

/*
 *
 * @method getAuxInfo
 * @return {string}
 */
IndigoInchi.prototype.getAuxInfo = function () {
	this.indigo._setSessionId();
	return this.indigo._checkResultString(this._lib.indigoInchiGetAuxInfo());
};

module.exports = IndigoInchi;

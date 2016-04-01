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
var libs_api = require(local('indigo-api'));
var IndigoObject = require(local('indigoObject'));
var ffi = require('ffi');

var Indigo = function (options) {
	options = options || {};
	var libpath = local('shared/' + process.platform + '/' + process.arch + '/'+ config[process.platform].libs['indigo']);
	this.libpath = options.libpath || libpath;
	this.logger = options.logger || console;
	this._lib = ffi.Library(libpath, libs_api);
	// Allocate a new session. Each session has its own
	// set of objects created and options set up.
	this._sid = this._lib.indigoAllocSessionId();
};

/*
 * Return Indigo version string.
 * 
 * @method getVersion
 * @return {String} Indigo version
 */
Indigo.prototype.getVersion = function () {
	return "Indigo version(" + this._lib.indigoVersion() + ");";
};

/* System */

/*
 * Switch to another session. The session, if was not allocated
 * previously, is allocated automatically and initialized with
 * empty set of objects and default options.
 * 
 * @method _setSessionId
 */
Indigo.prototype._setSessionId = function () {
	this._lib.indigoSetSessionId(this._sid)
};

/*
 * Release session. The memory used by the released session
 * is not freed, but the number will be reused on
 * further allocations.
 * 
 * @method _releaseSessionId
 */
Indigo.prototype._releaseSessionId = function () {
	if (this._lib)
		this._lib.indigoReleaseSessionId(this._sid);
};

/*
 * Get the last error message
 * 
 * @method getLastError
 */
Indigo.prototype.getLastError = function () {
	if (this._lib)
		return this._lib.indigoGetLastError();
	return '';
};

/*
 * Check results 
 * 
 * @method _checkResult
 * @param {number} result
 */
Indigo.prototype._checkResult = function (result) {
	if (result < 0) {
		var msg = this.getLastError();
		this.logger.error('res < 0[' + result + ']: ' + msg);
	}
	return result;
};

/*
 * Count object currently allocated
 * 
 * @method countReferences
 * @return {number} count
 */
Indigo.prototype.countReferences = function () {
        this._setSessionId();
        return this._checkResult(this._lib.indigoCountReferences());
    }

/*
 * Load molecule from string 
 * 
 * @method loadMolecule
 * @param {string} string reprsantation of molecule or a specification in form of a line notation for describing the structure of chemical species using short ASCII strings.
 * @return {object} IndigoObject
 */
Indigo.prototype.loadMolecule = function (string) {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoLoadMoleculeFromString(string)));
}

module.exports = new Indigo();

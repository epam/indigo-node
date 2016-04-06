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

IndigoObject = function (d, id, parent) {
	this.id = id;
	this.d = d;
	this.parent = parent;
}

/*
 * Free an object
 * 
 * @method dispose
 */
IndigoObject.prototype.dispose = function () {
	if (this.id >= 0)
		if (this.d._sid >= 0 && this.d._lib != null) {
			this.d._setSessionId();
			this.d._lib.indigoFree(this.id);
		}
	this.id = -1;
}

/*
 * Clone an object
 * 
 * @method clone
 */
IndigoObject.prototype.clone = function () {
	this.d._setSessionId();
	return new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoClone(this.id)));
}

/*
 * Get a 3d coordinates of an atom
 * 
 * @method xyz
 * @returns {Array} the [x, y, z] coordinates
 */
IndigoObject.prototype.xyz = function () {
	this.d._setSessionId();
	var xyz_ptr = this.d._lib.indigoXYZ(this.id); /* int atom */
	if (xyz_ptr.length == 0) {
		var msg = this.d.getLastError();
		this.d.logger.error('xyz [fault]: ' + msg);
		return [0.0, 0.0, 0.0];
	}

	var xyz = xyz_ptr.deref();
	return [xyz.x, xyz.y, xyz.z];
}

/*
 * Set a 3d coordinates of an atom
 * 
 * @method xyz
 * @returns {Array} the [x, y, z] coordinates
 */
IndigoObject.prototype.setXYZ = function (x, y, z) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoSetXYZ(this.id, x, y, z));
}

/*
 * Generate molfile from IndigoObject
 * 
 * @method molfile
 * @returns {string} string reprsantation of molfile
 */
IndigoObject.prototype.molfile = function () {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoMolfile(this.id));
}

/*
 * 
 * @method match
 * @param {object} query
 * @returns {object}  
 */
IndigoObject.prototype.match = function (query) {
	this.d._setSessionId();
	newobj = this.d._checkResult(this.d._lib.indigoMatch(this.id, query.id));
	if (newobj === 0)
		return null;
	else
		return new IndigoObject(d, newobj, this);
}

/*
 * 
 * @method match
 * @returns {string}  
 */
IndigoObject.prototype.smiles = function () {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoSmiles(this.id));
}

module.exports = IndigoObject;

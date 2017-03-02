/****************************************************************************
 * Copyright (C) 2016-2017 EPAM Systems
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
var refArray = require('ref-array');
var refStruct = require('ref-struct');

var IndigoException = function (message) {
	this.message = message;
	this.name = "IndigoException";
	this.stack = (new Error).stack;
};

IndigoException.prototype = new Error;

var IndigoObject = function (d, id, parent) {
	this.id = id;
	this.d = d;
	this.parent = parent;
};

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
};

/*
 * Clone an object
 *
 * @method clone
 */
IndigoObject.prototype.clone = function () {
	this.d._setSessionId();
	return new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoClone(this.id)));
};

/*
 * Close an object
 *
 * @method close
 * @returns {number}
 */
IndigoObject.prototype.close = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoClose(this.id));
};

/*
 *
 * @method count
 * @returns {number}
 */
IndigoObject.prototype.count = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoCount(this.id));
};
/*
 * @method oneBitsList
 * @returns {number}
 */
IndigoObject.prototype.oneBitsList = function () {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoOneBitsList(this.id));
};

/*
 *
 * @method mdlct
 * @returns {array}
 */
IndigoObject.prototype.mdlct = function () {
	this.d._setSessionId();
	var buf = this.d.writeBuffer();
	var res = this.d._checkResult(this.d._lib.indigoSaveMDLCT(this.id, buf.id));
	return buf.toBuffer();
};

/*
 * has an next object
 *
 * @method hasNext
 * @returns {number}
 */
IndigoObject.prototype.hasNext = function () {
	this.d._setSessionId();
	return (this.d._checkResult(this.d._lib.indigoHasNext(this.id)) == 1);
};

/*
 *
 * @method index
 * @returns {number}
 */
IndigoObject.prototype.index = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoIndex(this.id));
};

/*
 *
 * @method layout
 * @returns {number}
 */
IndigoObject.prototype.layout = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoLayout(this.id));
};

/*
 *
 * @method addReactant
 * @returns {number}
 */
IndigoObject.prototype.addReactant = function (molecule) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoAddReactant(this.id, molecule.id));
};

/*
 *
 * @method addProduct
 * @returns {number}
 */
IndigoObject.prototype.addProduct = function (molecule) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoAddProduct(this.id, molecule.id));
};

/*
 *
 * @method append
 * @returns {number}
 */
IndigoObject.prototype.append = function (object) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoAppend(this.id, object.id));
};

/*
 *
 * @method push
 * @returns {number}
 */
IndigoObject.prototype.push = function (object) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoAppend(this.id, object.id));
};

/*
 *
 * @method sdfAppend
 * @returns {number}
 */
IndigoObject.prototype.sdfAppend = function (item) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoSdfAppend(this.id, item.id));
};

/*
 *
 * @method smilesAppend
 * @returns {number}
 */
IndigoObject.prototype.smilesAppend = function (item) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoSmilesAppend(this.id, item.id));
};

/*
 *
 * @method rdfHeader
 * @returns {number}
 */
IndigoObject.prototype.rdfHeader = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoRdfHeader(this.id));
};

/*
 *
 * @method rdfAppend
 * @returns {number}
 */
IndigoObject.prototype.rdfAppend = function (item) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoRdfAppend(this.id, item.id));
};

/*
 *
 * @method cmlHeader
 * @returns {number}
 */
IndigoObject.prototype.cmlHeader = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoCmlHeader(this.id));
};

/*
 *
 * @method cmlAppend
 * @returns {number}
 */
IndigoObject.prototype.cmlAppend = function (item) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoCmlAppend(this.id, item.id));
};

/*
 *
 * @method cmlFooter
 * @returns {number}
 */
IndigoObject.prototype.cmlFooter = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoCmlFooter(this.id));
};

/*
 *
 * @method arrayAdd
 * @returns {number}
 */
IndigoObject.prototype.arrayAdd = function (object) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoArrayAdd(this.id, object.id));
};

/*
 *
 * @method topology
 * @returns {number}
 */
IndigoObject.prototype.topology = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoTopology(this.id));
};

/*
 *
 * @method resetStereo
 * @returns {number}
 */
IndigoObject.prototype.resetStereo = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoResetStereo(this.id));
};

/*
 *
 * @method invertStereo
 * @returns {number}
 */
IndigoObject.prototype.invertStereo = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoInvertStereo(this.id));
};

/*
 *
 * @method markEitherCisTrans
 * @returns {number}
 */
IndigoObject.prototype.markEitherCisTrans = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoMarkEitherCisTrans(this.id));
};

/*
 *
 * @method countAtoms
 * @returns {number}
 */
IndigoObject.prototype.countAtoms = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoCountAtoms(this.id));
};

/*
 *
 * @method countBonds
 * @returns {number}
 */
IndigoObject.prototype.countBonds = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoCountBonds(this.id));
};

/*
 *
 * @method bondOrder
 * @returns {number}
 */
IndigoObject.prototype.bondOrder = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoBondOrder(this.id));
};


/*
 *
 * @method countReactants
 * @returns {number}
 */
IndigoObject.prototype.countReactants = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoCountReactants(this.id));
};

/*
 *
 * @method countProducts
 * @returns {number}
 */
IndigoObject.prototype.countProducts = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoCountProducts(this.id));
};

/*
 *
 * @method countCatalysts
 * @returns {number}
 */
IndigoObject.prototype.countCatalysts = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoCountCatalysts(this.id));
};

/*
 *
 * @method countMolecules
 * @returns {number}
 */
IndigoObject.prototype.countMolecules = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoCountMolecules(this.id));
};

/*
 * Get a 3d coordinates of an atom
 *
 * @method xyz
 * @returns {Array} the [x, y, z] coordinates
 */
IndigoObject.prototype.xyz = function () {
	this.d._setSessionId();
	var xyzPtr = this.d._lib.indigoXYZ(this.id); /* int atom */
	if (xyzPtr.length == 0)
		throw IndigoException(this.d.getLastError());

	var xyz = xyzPtr.deref();
	return [xyz.x, xyz.y, xyz.z];
};

/*
 * Align atoms
 *
 * @method alignAtoms
 * @returns {Array} the [x, y, z] coordinates
 */
IndigoObject.prototype.alignAtoms = function (atoms, xyz) {
	this.d._setSessionId();
	if (atoms.length * 3 != xyz.length) {
		throw new IndigoException("alignAtoms(): xyz[] must be exactly 3 times bigger than atoms[]");
	}

	return this.d._checkResultFloat(this.d._lib.indigoAlignAtoms(this.id, atoms.length, atoms, xyz));
};

/*
 * Set a 3d coordinates of an atom
 *
 * @method setXYZ
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {number}
 */
IndigoObject.prototype.setXYZ = function (x, y, z) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoSetXYZ(this.id, x, y, z));
};

/*
 *
 * @method atomicNumber
 * @returns {number}
 */
IndigoObject.prototype.atomicNumber = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoAtomicNumber(this.id));
};

/*
 * Set
 *
 * @method setAttachmentPoint
 * @param {number} order
 * @returns {number}
 */
IndigoObject.prototype.setAttachmentPoint = function (order) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoSetAttachmentPoint(this.id, order));
};

/*
 * Clear
 *
 * @method clearAttachmentPoints
 * @returns {number}
 */
IndigoObject.prototype.clearAttachmentPoints = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoClearAttachmentPoints(this.id));
};

/*
 * Count
 *
 * @method countComponents
 * @returns {number}
 */
IndigoObject.prototype.countComponents = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoCountComponents(this.id));
};

/*
 *
 * @method componentIndex
 * @returns {number}
 */
IndigoObject.prototype.componentIndex = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoComponentIndex(this.id));
};

/*
 *
 * @method iterateReactants
 * @returns {object}
 */
IndigoObject.prototype.iterateReactants = function* () {
	this.d._setSessionId();
	var rxn = new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoIterateReactants(this.id)));
	var newobj = rxn;
	while (newobj && newobj.id !== -1) if (newobj = rxn._next()) yield newobj;
};

/*
 *
 * @method iterateProducts
 * @returns {object}
 */
IndigoObject.prototype.iterateProducts = function* () {
	this.d._setSessionId();
	var pr = new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoIterateProducts(this.id)));
	var newobj = pr;
	while (newobj && newobj.id !== -1) if (newobj = pr._next()) yield newobj;
};

/*
 *
 * @method iterateCatalysts
 * @returns {object}
 */
IndigoObject.prototype.iterateCatalysts = function* () {
	this.d._setSessionId();
	var cat = new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoIterateCatalysts(this.id)));
	var newobj = cat;
	while (newobj && newobj.id !== -1) if (newobj = cat._next()) yield newobj;
};

/*
 *
 * @method iterateMolecules
 * @returns {object}
 */
IndigoObject.prototype.iterateMolecules = function* () {
	this.d._setSessionId();
	var mol = new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoIterateMolecules(this.id)));
	var newobj = mol;
	while (newobj && newobj.id !== -1) if (newobj = mol._next()) yield newobj;
};

/*
 *
 * @method molecularWeight
 * @returns {number}
 */
IndigoObject.prototype.molecularWeight = function () {
	this.d._setSessionId();
	return this.d._checkResultFloat(this.d._lib.indigoMolecularWeight(this.id));
};

/*
 *
 * @method mostAbundantMass
 * @returns {number}
 */
IndigoObject.prototype.mostAbundantMass = function () {
	this.d._setSessionId();
	return this.d._checkResultFloat(this.d._lib.indigoMostAbundantMass(this.id));
};

/*
 *
 * @method monoisotopicMass
 * @returns {number}
 */
IndigoObject.prototype.monoisotopicMass = function () {
	this.d._setSessionId();
	return this.d._checkResultFloat(this.d._lib.indigoMonoisotopicMass(this.id));
};

/*
 *
 * @method iterateComponents
 * @returns {object}
 */
IndigoObject.prototype.iterateComponents = function* () {
	this.d._setSessionId();
	var component = new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoIterateComponents(this.id)));
	var newobj = component;
	while (newobj && newobj.id !== -1) if (newobj = component._next()) yield newobj;
};

/*
 *
 * @method component
 * @returns {object}
 */
IndigoObject.prototype.component = function (index) {
	this.d._setSessionId();
	return new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoComponent(this.id, index)));
};

/*
 * Generate molfile from IndigoObject
 *
 * @method molfile
 * @returns {string} string reprsantation of molfile
 */
IndigoObject.prototype.molfile = function () {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoMolfile(this.id));
};

/*
 * Generate CML from IndigoObject
 *
 * @method molfile
 * @returns {string} string reprsantation of molfile
 */
IndigoObject.prototype.cml = function () {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoCml(this.id));
};

/*
 *
 * @method match
 * @param {object} query
 * @returns {object}
 */
IndigoObject.prototype.match = function (query) {
	this.d._setSessionId();
	var newobj = this.d._checkResult(this.d._lib.indigoMatch(this.id, query.id));
	if (newobj === 0 || newobj === -1)
		return null;
	else
		return new IndigoObject(this.d, newobj, this);
};

/*
 *
 * @method countMatches
 * @param {object} query
 * @returns {number}
 */
IndigoObject.prototype.countMatches = function (query) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoCountMatches(this.id, query.id));
};

/*
 *
 * @method countMatchesWithLimit
 * @param {object} query
 * @returns {number}
 */
IndigoObject.prototype.countMatchesWithLimit = function (query, embeddings_limit) {
	this.d._setSessionId();
	var e_limit = embeddings_limit || 0; /*see indigoCountMatches implementation*/
	return this.d._checkResult(this.d._lib.indigoCountMatchesWithLimit(this.id, query.id, e_limit));
};

/*
 *
 * @method iterateMatches
 * @returns {object}
 */
IndigoObject.prototype.iterateMatches = function* (query) {
	this.d._setSessionId();
	var mtch = new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoIterateMatches(this.id, query.id)));
	var newobj = mtch;
	while (newobj && newobj.id !== -1) if (newobj = mtch._next()) yield newobj;
};

/*
 *
 * @method highlightedTarget
 * @returns {object}
 */
IndigoObject.prototype.highlightedTarget = function () {
	this.d._setSessionId();
	return new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoHighlightedTarget(this.id)));
};

/*
 *
 * @method mapAtom
 * @param {object} atom
 * @returns {object}
 */
IndigoObject.prototype.mapAtom = function (atom) {
	this.d._setSessionId();
	var newobj = this.d._checkResult(this.d._lib.indigoMapAtom(this.id, atom.id));
	if (newobj === 0 || newobj === -1)
		return null;
	else
		return new IndigoObject(this.d, newobj, this);
};

/*
 *
 * @method mapBond
 * @param {object} bond
 * @returns {object}
 */
IndigoObject.prototype.mapBond = function (bond) {
	this.d._setSessionId();
	var newobj = this.d._checkResult(this.d._lib.indigoMapBond(this.id, bond.id));
	if (newobj === 0 || newobj === -1)
		return null;
	else
		return new IndigoObject(this.d, newobj, this);
};

/*
 *
 * @method mapMolecule
 * @param {object} molecule
 * @returns {object}
 */
IndigoObject.prototype.mapMolecule = function (molecule) {
	this.d._setSessionId();
	var newobj = this.d._checkResult(this.d._lib.indigoMapMolecule(this.id, molecule.id));
	if (newobj === 0 || newobj === -1)
		return null;
	else
		return new IndigoObject(this.d, newobj, this);
};

/*
 *
 * @method smiles
 * @returns {string}
 */
IndigoObject.prototype.smiles = function () {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoSmiles(this.id));
};

/*
 *
 * @method _next
 * @returns {object}
 */
IndigoObject.prototype._next = function () {
	this.d._setSessionId();
	var newobj = this.d._checkResult(this.d._lib.indigoNext(this.id));
	return (newobj && newobj !== -1)? new IndigoObject(this.d, newobj, this):null;
};

/*
 *
 * @method hasProperty
 * @returns {number}
 */
IndigoObject.prototype.hasProperty = function (property) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoHasProperty(this.id, property));
};

/*
 *
 * @method getProperty
 * @returns {string}
 */
IndigoObject.prototype.getProperty = function (property) {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoGetProperty(this.id, property));
};

/*
 *
 * @method setProperty
 * @returns {number}
 */
IndigoObject.prototype.setProperty = function (property, value) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoSetProperty(this.id, property, value));
};

/*
 *
 * @method removeProperty
 * @returns {number}
 */
IndigoObject.prototype.removeProperty = function (property) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoRemoveProperty(this.id, property));
};

/*
 *
 * @method iterateProperties
 * @returns {object}
 */
IndigoObject.prototype.iterateProperties = function* () {
	this.d._setSessionId();
	var prop = new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoIterateProperties(this.id)));
	var newobj = prop;
	while (newobj && newobj.id !== -1) if (newobj = prop._next()) yield newobj;
};

/*
 *
 * @method clearProperties
 * @returns {number}
 */
IndigoObject.prototype.clearProperties = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoClearProperties(this.id));
};

/*
 *
 * @method checkBadValence
 * @returns {string}
 */
IndigoObject.prototype.checkBadValence = function () {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoCheckBadValence(this.id));
};

/*
 *
 * @method checkAmbiguousH
 * @returns {string}
 */
IndigoObject.prototype.checkAmbiguousH = function () {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoCheckAmbiguousH(this.id));
};

/*
 *
 * @method iterateAtoms
 * @returns {object}
 */
IndigoObject.prototype.iterateAtoms = function* () {
	this.d._setSessionId();
	var atom = new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoIterateAtoms(this.id)));
	var newobj = atom;
	while (newobj && newobj.id !== -1) if (newobj = atom._next()) yield newobj;
};

/*
 *
 * @method iterateBonds
 * @returns {object}
 */
IndigoObject.prototype.iterateBonds = function* () {
	this.d._setSessionId();
	var bond = new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoIterateBonds(this.id)));
	var newobj = bond;
	while (newobj && newobj.id !== -1) if (newobj = bond._next()) yield newobj;
};

/*
 *
 * @method iteratePseudoatoms
 * @returns {object}
 */
IndigoObject.prototype.iteratePseudoatoms = function* () {
	this.d._setSessionId();
	var atom = new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoIteratePseudoatoms(this.id)));
	var newobj = atom;
	while (newobj && newobj.id !== -1) if (newobj = atom._next()) yield newobj;
};

/*
 *
 * @method iterateRSites
 * @returns {object}
 */
IndigoObject.prototype.iterateRSites = function* () {
	this.d._setSessionId();
	var rsite = new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoIterateRSites(this.id)));
	var newobj = rsite;
	while (newobj && newobj.id !== -1) if (newobj = rsite._next()) yield newobj;
};

/*
 *
 * @method iterateNeighbors
 * @returns {object}
 */
IndigoObject.prototype.iterateNeighbors = function* () {
	this.d._setSessionId();
	var nei = new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoIterateNeighbors(this.id)));
	var newobj = nei;
	while (newobj && newobj.id !== -1) if (newobj = nei._next()) yield newobj;
};

/*
 *
 * @method bond
 * @returns {object}
 */
IndigoObject.prototype.bond = function () {
	this.d._setSessionId();
	return new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoBond(this.id)));
};

/*
 *
 * @method getAtom
 * @returns {object}
 */
IndigoObject.prototype.getAtom = function (index) {
	this.d._setSessionId();
	return new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoGetAtom(this.id, index)));
};

/*
 *
 * @method getBond
 * @returns {object}
 */
IndigoObject.prototype.getBond = function (index) {
	this.d._setSessionId();
	return new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoGetBond(this.id, index)));
};

/*
 *
 * @method source
 * @returns {object}
 */
IndigoObject.prototype.source = function () {
	this.d._setSessionId();
	return new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoSource(this.id)));
};

/*
 *
 * @method destination
 * @returns {object}
 */
IndigoObject.prototype.destination = function () {
	this.d._setSessionId();
	return new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoDestination(this.id)));
};

/*
 *
 * @method removeConstraints
 * @returns {number}
 */
IndigoObject.prototype.removeConstraints = function (type) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoRemoveConstraints(this.id, type));
};

/*
 *
 * @method addConstraint
 * @returns {number}
 */
IndigoObject.prototype.addConstraint = function (type, value) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoAddConstraint(this.id, type, value));
};

/*
 *
 * @method addConstraintNot
 * @returns {number}
 */
IndigoObject.prototype.addConstraintNot = function (type, value) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoAddConstraintNot(this.id, type, value));
};

/*
 *
 * @method addConstraintOr
 * @returns {number}
 */
IndigoObject.prototype.addConstraintOr = function (type, value) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoAddConstraintOr(this.id, type, value));
};

/*
 *
 * @method canonicalSmiles
 * @returns {string}
 */
IndigoObject.prototype.canonicalSmiles = function () {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoCanonicalSmiles(this.id));
};

/*
 *
 * @method unfoldHydrogens
 * @returns {number}
 */
IndigoObject.prototype.unfoldHydrogens = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoUnfoldHydrogens(this.id));
};

/*
 *
 * @method resetAtom
 * @returns {number}
 */
IndigoObject.prototype.resetAtom = function (symbol) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoResetAtom(this.id, symbol));
};

/*
 *
 * @method setName
 * @returns {number}
 */
IndigoObject.prototype.setName = function (name) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoSetName(this.id, name));
};

/*
 *
 * @method serialize
 * @returns {Array}
 */
IndigoObject.prototype.serialize = function () {
	this.d._setSessionId();
	var size = ref.alloc('int'); // allocate a 4-byte (32-bit) chunk for the output value
	var pointer = ref.alloc(ref.refType('byte'));
	var status = this.d._checkResult(this.d._lib.indigoSerialize(this.id, pointer, size));
	var buf = ref.readPointer(pointer, 0, size.deref());
	var res = [];
	for (var i = 0; i < size.deref(); i++) {
		res.push(buf[i]);
	}
	return res;
};

/*
 *
 * @method reactingCenter
 * @returns {number}
 */
IndigoObject.prototype.reactingCenter = function (reaction_bond) {
	this.d._setSessionId();
	if (reaction_bond === undefined || reaction_bond === null) {
		return 0;
	}
	var value = ref.alloc('int');
	var res = this.d._checkResult(this.d._lib.indigoGetReactingCenter(this.id, reaction_bond.id, value));
	if (res === null)
		return null;
	else
		return value.deref();
};

/*
 *
 * @method setReactingCenter
 * @returns {number}
 */
IndigoObject.prototype.setReactingCenter = function (reaction_bond, rc) {
	this.d._setSessionId();
	if (reaction_bond === undefined || reaction_bond === null) {
		return 0;
	}
	return this.d._checkResult(this.d._lib.indigoSetReactingCenter(this.id, reaction_bond.id, rc));
};

/*
 *
 * @method clearAAM
 * @returns {number}
 */
IndigoObject.prototype.clearAAM = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoClearAAM(this.id));
};

/*
 *
 * @method correctReactingCenters
 * @returns {number}
 */
IndigoObject.prototype.correctReactingCenters = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoCorrectReactingCenters(this.id));
};

/*
 *
 * @method charge
 * @returns {number}
 */
IndigoObject.prototype.charge = function () {
	this.d._setSessionId();
	var value = ref.alloc('int');
	var res = this.d._checkResult(this.d._lib.indigoGetCharge(this.id, value));
	if (res === null)
		return null;
	else
		return value.deref();
};

/*
 *
 * @method valence
 * @returns {number}
 */
IndigoObject.prototype.valence = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoValence(this.id));
};

/*
 *
 * @method clearStereocenters
 * @returns {number}
 */
IndigoObject.prototype.clearStereocenters = function () {
	this.d._setSessionId(); /* only molecules and reactions have stereocenters */
	return this.d._checkResult(this.d._lib.indigoClearStereocenters(this.id));
};

/*
 *
 * @method grossFormula
 * @returns {string}
 */
IndigoObject.prototype.grossFormula = function () {
	this.d._setSessionId();
	var gfid = this.d._checkResult(this.d._lib.indigoGrossFormula(this.id));
	var gf = new IndigoObject(this.d, gfid);
	return this.d._checkResultString(this.d._lib.indigoToString(gf.id));
};

/*
 *
 * @method name
 * @returns {string}
 */
IndigoObject.prototype.name = function () {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoName(this.id));
};

/*
 *
 * @method rawData
 * @returns {string}
 */
IndigoObject.prototype.rawData = function () {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoRawData(this.id));
};

/*
 *
 * @method saveRxnfile
 * @returns {number}
 */
IndigoObject.prototype.saveRxnfile = function (filename) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoSaveRxnfileToFile(this.id, filename));
};

/*
 *
 * @method rxnfile
 * @returns {string}
 */
IndigoObject.prototype.rxnfile = function () {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoRxnfile(this.id));
};

/*
 *
 * @method optimize
 * @returns {number}
 */
IndigoObject.prototype.optimize = function (options) {
	this.d._setSessionId();
	if (options === undefined || options === null) {
		options = '';
	}
	return this.d._checkResult(this.d._lib.indigoOptimize(this.id, options));
};

/*
 *
 * @method normalize
 * @returns {number}
 */
IndigoObject.prototype.normalize = function (options) {
	this.d._setSessionId();
	if (options === undefined || options === null) {
		options = '';
	}
	return this.d._checkResult(this.d._lib.indigoNormalize(this.id, options));
};

/*
 *
 * @method standardize
 * @returns {number}
 */
IndigoObject.prototype.standardize = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoStandardize(this.id));
};

/*
 *
 * @method automap
 * @returns {number}
 */
IndigoObject.prototype.automap = function (mode) {
	this.d._setSessionId();
	if (mode === undefined || mode === null) {
		var options = '';
	}
	return this.d._checkResult(this.d._lib.indigoAutomap(this.id, mode));
};

/*
 *
 * @method aromatize
 * @returns {number}
 */
IndigoObject.prototype.aromatize = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoAromatize(this.id));
};


/*
 *
 * @method dearomatize
 * @returns {number}
 */
IndigoObject.prototype.dearomatize = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoDearomatize(this.id));
};

/*
 *
 * @method symbol
 * @returns {string}
 */
IndigoObject.prototype.symbol = function () {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoSymbol(this.id));
};

/*
 *
 * @method resetSymmetricCisTrans
 * @returns {number}
 */
IndigoObject.prototype.resetSymmetricCisTrans = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoResetSymmetricCisTrans(this.id));
};

/*
 *
 * @method resetSymmetricStereocenters
 * @returns {number}
 */
IndigoObject.prototype.resetSymmetricStereocenters = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoResetSymmetricStereocenters(this.id));
};

/*
 *
 * @method addDataSGroup
 * @returns {object}
 */
IndigoObject.prototype.addDataSGroup = function (atoms, bonds, description, data) {
	this.d._setSessionId();
	return new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoAddDataSGroup(this.id, atoms.length, atoms, bonds.length, bonds, description, data)));
};

/*
 *
 * @method addSuperatom
 * @returns {object}
 */
IndigoObject.prototype.addSuperatom = function (atoms, name) {
	this.d._setSessionId();
	return new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoAddSuperatom(this.id, atoms.length, atoms, name)));
};

/*
 *
 * @method createSubmolecule
 * @returns {object}
 */
IndigoObject.prototype.createSubmolecule = function (vertices) {
	this.d._setSessionId();
	return new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoCreateSubmolecule(this.id, vertices.length, vertices)));
};

/*
 *
 * @method createEdgeSubmolecule
 * @returns {object}
 */
IndigoObject.prototype.createEdgeSubmolecule = function (vertices, edges) {
	this.d._setSessionId();
	return new IndigoObject(this.d, this.d._checkResult(this.d._lib.indigoCreateEdgeSubmolecule(this.id, vertices.length, vertices, edges.length, edges)));
};

/*
 *
 * @method getSubmolecule
 * @returns {number}
 */
IndigoObject.prototype.getSubmolecule = function (vertices) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoGetSubmolecule(this.id, vertices.length, vertices));
};

/*
 *
 * @method removeAtoms
 * @returns {number}
 */
IndigoObject.prototype.removeAtoms = function (atoms) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoRemoveAtoms(this.id, atoms.length, atoms));
};

/*
 *
 * @method removeBonds
 * @returns {number}
 */
IndigoObject.prototype.removeBonds = function (bonds) {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoRemoveBonds(this.id, bonds.length, bonds));
};

/*
 *
 * @method foldHydrogens
 * @returns {number}
 */
IndigoObject.prototype.foldHydrogens = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoFoldHydrogens(this.id));
};

/*
 *
 * @method markStereobonds
 * @returns {number}
 */
IndigoObject.prototype.markStereobonds = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoMarkStereobonds(this.id));
};

/*
 *
 * @method toString
 * @returns {string}
 */
IndigoObject.prototype.toString = function () {
	this.d._setSessionId();
	return this.d._checkResultString(this.d._lib.indigoToString(this.id));
};

/*
 *
 * @method toBuffer
 * @returns {Array}
 */
IndigoObject.prototype.toBuffer = function () {
	this.d._setSessionId();
	var size = ref.alloc('int');
	var pointer = ref.alloc(ref.refType('byte'));
	var status = this.d._checkResult(this.d._lib.indigoToBuffer(this.id, pointer, size));
	var buf = ref.readPointer(pointer, 0, size.deref());
	var res = [];
	for (var i = 0; i < size.deref(); i++) {
		res.push(buf[i]);
	}
	return res;
};

var Indigo = function (basepath) {
	if (!basepath)
		basepath = path.join(__dirname, 'lib');

	var osMap = {
		'linux': 'Linux',
		'darwin': 'Mac',
		'win32': 'Win'
	};
	if (!osMap[process.platform] ||
	    ['x86', 'x64'].indexOf(process.arch) == -1)
		throw IndigoException("Unknown platform " + process.platform +
		                      " (" + process.arch + ")");

	this.dllpath = path.join(basepath, osMap[process.platform], process.arch);
	var libpath = path.join(this.dllpath,
	                        process.platform != 'win32' ? 'libindigo' : 'indigo');

	if (process.platform == 'linux') {
		// Indigo must be loaded with `RTLD_GLOBAL` flag
		// to make plugins work. See https://git.io/voPPW
		var mode = ffi.DynamicLibrary.FLAGS.RTLD_GLOBAL |
		           ffi.DynamicLibrary.FLAGS.RTLD_LAZY;
		var exportSyms = new ffi.DynamicLibrary(libpath + ffi.LIB_EXT, mode);
	}

	var xyz = refStruct({ x: 'float', y: 'float', z: 'float' });
	this._lib = ffi.Library(libpath, {
		"indigoSetOption" : ["int", ["string", "string"]],
		"indigoSetOptionInt" : ["int", ["string", "int"]],
		"indigoSetOptionBool" : ["int", ["string", "int"]],
		"indigoSetOptionFloat" : ["int", ["string", "float"]],
		"indigoSetOptionColor" : ["int", ["string", "float", "float", "float"]],
		"indigoSetOptionXY" : ["int", ["string", "int", "int"]],
		"indigoDbgBreakpoint": ["void", []],
		"indigoVersion": ["string", []],
		"indigoAllocSessionId": ['uint64', []],
		"indigoSetSessionId": ["void", ['uint64']],
		"indigoReleaseSessionId": ["void", ['uint64']],
		"indigoGetLastError": ["string", []],
		"indigoFree": ["int", ["int"]],
		"indigoCountReferences": ["int", []],
		"indigoFreeAllObjects": ["int", []],
		"indigoWriteBuffer": ["int", []],
		"indigoCreateMolecule": ["int", []],
		"indigoCreateQueryMolecule": ["int", []],
		"indigoNext": ["int", ["int"]],
		"indigoHasNext": ["int", ["int"]],
		"indigoClone": ["int", ["int"]],
		"indigoClose": ["int", ["int"]],
		"indigoIndex": ["int", ["int"]],
		"indigoRemove": ["int", ["int"]],
		"indigoSaveMolfileToFile": ["int", ["string"]],
		"indigoMolfile": ["string", ["int"]],
		"indigoSaveCmlToFile": ["int", ["string"]],
		"indigoCml": ["string", ["int"]],
		"indigoSaveMDLCT": ["int", ["int", "int"]],
		"indigoAddReactant": ["int", ["int", "int"]],
		"indigoAddProduct": ["int", ["int", "int"]],
		"indigoAddCatalyst": ["int", ["int", "int"]],
		"indigoCountReactants": ["int", ["int"]],
		"indigoCountProducts": ["int", ["int"]],
		"indigoCountCatalysts": ["int", ["int"]],
		"indigoCountMolecules": ["int", ["int"]],
		"indigoGetMolecule": ["int", ["int", "int"]],
		"indigoIterateReactants": ["int", ["int"]],
		"indigoIterateProducts": ["int", ["int"]],
		"indigoIterateCatalysts": ["int", ["int"]],
		"indigoIterateMolecules": ["int", ["int"]],
		"indigoSaveRxnfileToFile": ["int", ["int", "string"]],
		"indigoRxnfile": ["string", ["int"]],
		"indigoOptimize": ["int", ["int", "string"]],
		"indigoNormalize": ["int", ["int", "string"]],
		"indigoStandardize": ["int", ["int"]],
		"indigoAutomap": ["int", ["int", "string"]],
		"indigoGetAtomMappingNumber": ["int", ["int", "int"]],
		"indigoSetAtomMappingNumber": ["int", ["int", "int", "int"]],
		"indigoGetReactingCenter": ["int", ["int", "int", ref.refType('int')]],
		"indigoSetReactingCenter": ["int", ["int", "int", "int"]],
		"indigoClearAAM": ["int", ["int"]],
		"indigoCorrectReactingCenters": ["int", ["int"]],
		"indigoIterateAtoms": ["int", ["int"]],
		"indigoIteratePseudoatoms": ["int", ["int"]],
		"indigoIterateRSites": ["int", ["int"]],
		"indigoIterateStereocenters": ["int", ["int"]],
		"indigoIterateAlleneCenters": ["int", ["int"]],
		"indigoIterateRGroups": ["int", ["int"]],
		"indigoIsPseudoatom": ["int", ["int"]],
		"indigoIsRSite": ["int", ["int"]],
		"indigoStereocenterType": ["int", ["int"]],
		"indigoStereocenterGroup": ["int", ["int"]],
		"indigoSetStereocenterGroup": ["int", ["int", "int"]],
		"indigoChangeStereocenterType": ["int", ["int", "int"]],
		"indigoValidateChirality": ["int", ["int"]],
		"indigoSingleAllowedRGroup": ["int", ["int"]],
		"indigoAddStereocenter": ["int", ["int", "int", "int", "int", "int", "int"]],
		"indigoIterateRGroupFragments": ["int", ["int"]],
		"indigoCountAttachmentPoints": ["int", ["int"]],
		"indigoIterateAttachmentPoints": ["int", ["int", "int"]],
		"indigoSymbol": ["string", ["int"]],
		"indigoDegree": ["int", ["int"]],
		"indigoGetCharge": ["int", ["int", ref.refType('int')]],
		"indigoGetExplicitValence": ["int", ["int", ref.refType('int')]],
		"indigoSetExplicitValence": ["int", ["int", "int"]],
		"indigoGetRadicalElectrons": ["int", ["int", ref.refType('int')]],
		"indigoGetRadical": ["int", ["int", ref.refType('int')]],
		"indigoSetRadical": ["int", ["int", "int"]],
		"indigoAtomicNumber": ["int", ["int"]],
		"indigoIsotope": ["int", ["int"]],
		"indigoValence": ["int", ["int"]],
		"indigoCountHydrogens": ["int", ["int", ref.refType('int')]],
		"indigoCountImplicitHydrogens": ["int", ["int"]],
		"indigoXYZ": [ref.refType(xyz), ["int"]],
		"indigoSetXYZ": ["int", ["int", "float", "float", "float"]],
		"indigoCountSuperatoms": ["int", ["int"]],
		"indigoCountDataSGroups": ["int", ["int"]],
		"indigoCountRepeatingUnits": ["int", ["int"]],
		"indigoCountMultipleGroups": ["int", ["int"]],
		"indigoCountGenericSGroups": ["int", ["int"]],
		"indigoIterateDataSGroups": ["int", ["int"]],
		"indigoIterateSuperatoms": ["int", ["int"]],
		"indigoIterateGenericSGroups": ["int", ["int"]],
		"indigoIterateRepeatingUnits": ["int", ["int"]],
		"indigoIterateMultipleGroups": ["int", ["int"]],
		"indigoGetSuperatom": ["int", ["int", "int"]],
		"indigoGetDataSGroup": ["int", ["int", "int"]],
		"indigoGetGenericSGroup": ["int", ["int", "int"]],
		"indigoGetMultipleGroup": ["int", ["int", "int"]],
		"indigoGetRepeatingUnit": ["int", ["int", "int"]],
		"indigoDescription": ["string", ["int"]],
		"indigoData": ["string", ["int"]],
		"indigoAddDataSGroup": ["int", ["int", "int", refArray('int'), "int", refArray('int'), "string", "string"]],
		"indigoAddSuperatom": ["int", ["int", "int", refArray('int'), "string"]],
		"indigoSetDataSGroupXY": ["int", ["int", "float", "float", "string"]],
		"indigoSetSGroupData": ["int", ["int", "string"]],
		"indigoSetSGroupCoords": ["int", ["int", "float", "float"]],
		"indigoSetSGroupDescription": ["int", ["int", "string"]],
		"indigoSetSGroupFieldName": ["int", ["int", "string"]],
		"indigoSetSGroupQueryCode": ["int", ["int", "string"]],
		"indigoSetSGroupQueryOper": ["int", ["int", "string"]],
		"indigoSetSGroupDisplay": ["int", ["int", "string"]],
		"indigoSetSGroupLocation": ["int", ["int", "string"]],
		"indigoSetSGroupTag": ["int", ["int", "string"]],
		"indigoSetSGroupTagAlign": ["int", ["int", "string"]],
		"indigoSetSGroupDataType": ["int", ["int", "string"]],
		"indigoSetSGroupXCoord": ["int", ["int", "float"]],
		"indigoSetSGroupYCoord": ["int", ["int", "float"]],
		"indigoCreateSGroup": ["int", ["string", "int", "string"]],
		"indigoSetSGroupClass": ["int", ["int", "string"]],
		"indigoSetSGroupName": ["int", ["int", "string"]],
		"indigoGetSGroupClass": ["string", ["int"]],
		"indigoGetSGroupName": ["string", ["int"]],
		"indigoGetSGroupNumCrossBonds": ["int", ["int"]],
		"indigoAddSGroupAttachmentPoint": ["int", ["int", "int", "int", "string"]],
		"indigoDeleteSGroupAttachmentPoint": ["int", ["int", "int"]],
		"indigoGetSGroupDisplayOption": ["int", ["int"]],
		"indigoSetSGroupDisplayOption": ["int", ["int", "int"]],
		"indigoGetSGroupMultiplier": ["int", ["int"]],
		"indigoSetSGroupMultiplier": ["int", ["int", "int"]],
		"indigoSetSGroupBrackets": ["int", ["int", "int", "float", "float", "float", "float", "float", "float", "float", "float"]],
		"indigoFindSGroups": ["int", ["int", "string", "string"]],
		"indigoGetSGroupType": ["int", ["int"]],
		"indigoGetSGroupIndex": ["int", ["int"]],
		"indigoTransformSCSRtoCTAB": ["int", ["int"]],
		"indigoTransformCTABtoSCSR": ["int", ["int", "int"]],
		"indigoResetCharge": ["int", ["int"]],
		"indigoResetExplicitValence": ["int", ["int"]],
		"indigoResetRadical": ["int", ["int"]],
		"indigoResetIsotope": ["int", ["int"]],
		"indigoSetAttachmentPoint": ["int", ["int", "int"]],
		"indigoClearAttachmentPoints": ["int", ["int"]],
		"indigoRemoveConstraints": ["int", ["int", "string"]],
		"indigoAddConstraint": ["int", ["int", "string", "string"]],
		"indigoAddConstraintNot": ["int", ["int", "string", "string"]],
		"indigoAddConstraintOr": ["int", ["int", "string", "string"]],
		"indigoResetStereo": ["int", ["int"]],
		"indigoInvertStereo": ["int", ["int"]],
		"indigoCountAtoms": ["int", ["int"]],
		"indigoCountBonds": ["int", ["int"]],
		"indigoCountPseudoatoms": ["int", ["int"]],
		"indigoCountRSites": ["int", ["int"]],
		"indigoIterateBonds": ["int", ["int"]],
		"indigoBondOrder": ["int", ["int"]],
		"indigoBondStereo": ["int", ["int"]],
		"indigoTopology": ["int", ["int"]],
		"indigoIterateNeighbors": ["int", ["int"]],
		"indigoBond": ["int", ["int"]],
		"indigoGetAtom": ["int", ["int", "int"]],
		"indigoGetBond": ["int", ["int", "int"]],
		"indigoSource": ["int", ["int"]],
		"indigoDestination": ["int", ["int"]],
		"indigoClearCisTrans": ["int", ["int"]],
		"indigoClearStereocenters": ["int", ["int"]],
		"indigoCountStereocenters": ["int", ["int"]],
		"indigoClearAlleneCenters": ["int", ["int"]],
		"indigoCountAlleneCenters": ["int", ["int"]],
		"indigoResetSymmetricCisTrans": ["int", ["int"]],
		"indigoResetSymmetricStereocenters": ["int", ["int"]],
		"indigoMarkEitherCisTrans": ["int", ["int"]],
		"indigoMarkStereobonds": ["int", ["int"]],
		"indigoAddAtom": ["int", ["int", "string"]],
		"indigoResetAtom": ["int", ["int", "string"]],
		"indigoAddRSite": ["int", ["int", "string"]],
		"indigoSetRSite": ["int", ["int", "string"]],
		"indigoSetCharge": ["int", ["int", "int"]],
		"indigoSetIsotope": ["int", ["int", "int"]],
		"indigoSetImplicitHCount": ["int", ["int", "int"]],
		"indigoAddBond": ["int", ["int", "int", "int"]],
		"indigoSetBondOrder": ["int", ["int", "int"]],
		"indigoMerge": ["int", ["int", "int"]],
		"indigoHighlight": ["int", ["int"]],
		"indigoUnhighlight": ["int", ["int"]],
		"indigoIsHighlighted": ["int", ["int"]],
		"indigoCountComponents": ["int", ["int"]],
		"indigoComponentIndex": ["int", ["int"]],
		"indigoIterateComponents": ["int", ["int"]],
		"indigoComponent": ["int", ["int", "int"]],
		"indigoCountSSSR": ["int", ["int"]],
		"indigoIterateSSSR": ["int", ["int"]],
		"indigoIterateSubtrees": ["int", ["int", "int", "int"]],
		"indigoIterateRings": ["int", ["int", "int", "int"]],
		"indigoIterateEdgeSubmolecules": ["int", ["int", "int", "int"]],
		"indigoCountHeavyAtoms": ["int", ["int"]],
		"indigoGrossFormula": ["int", ["int"]],
		"indigoMolecularWeight": ["float", ["int"]],
		"indigoMostAbundantMass": ["float", ["int"]],
		"indigoMonoisotopicMass": ["float", ["int"]],
		"indigoCanonicalSmiles": ["string", ["int"]],
		"indigoLayeredCode": ["string", ["int"]],
		"indigoSymmetryClasses": [ref.refType('int'), ["int", ref.refType('int')]],
		"indigoHasCoord": ["int", ["int"]],
		"indigoHasZCoord": ["int", ["int"]],
		"indigoIsChiral": ["int", ["int"]],
		"indigoCreateSubmolecule": ["int", ["int", "int", refArray('int')]],
		"indigoCreateEdgeSubmolecule": ["int", ["int", "int", refArray('int'), "int", refArray('int')]],
		"indigoGetSubmolecule": ["int", ["int", "int", refArray('int')]],
		"indigoRemoveAtoms": ["int", ["int", "int", refArray('int')]],
		"indigoRemoveBonds": ["int", ["int", "int", refArray('int')]],
		"indigoAlignAtoms": ["float", ["int", "int", refArray('int'), refArray('float')]],
		"indigoAromatize": ["int", ["int"]],
		"indigoDearomatize": ["int", ["int"]],
		"indigoFoldHydrogens": ["int", ["int"]],
		"indigoUnfoldHydrogens": ["int", ["int"]],
		"indigoLayout": ["int", ["int"]],
		"indigoSmiles": ["string", ["int"]],
		"indigoName": ["string", ["int"]],
		"indigoSetName": ["int", ["int", "string"]],
		"indigoSerialize": ["int", ["int", ref.refType(ref.refType('byte')), ref.refType('int')]],
		"indigoHasProperty": ["int", ["int", "string"]],
		"indigoGetProperty": ["string", ["int", "string"]],
		"indigoSetProperty": ["int", ["int", "string", "string"]],
		"indigoRemoveProperty": ["int", ["int", "string"]],
		"indigoIterateProperties": ["int", ["int"]],
		"indigoClearProperties": ["int", ["int"]],
		"indigoCheckBadValence": ["string", ["int"]],
		"indigoCheckAmbiguousH": ["string", ["int"]],
		"indigoFingerprint": ["int", ["int", "string"]],
		"indigoCountBits": ["int", ["int"]],
		"indigoRawData": ["string", ["int"]],
		"indigoTell": ["int", ["int"]],
		"indigoSdfAppend": ["int", ["int", "int"]],
		"indigoSmilesAppend": ["int", ["int", "int"]],
		"indigoRdfHeader": ["int", ["int"]],
		"indigoRdfAppend": ["int", ["int", "int"]],
		"indigoCmlHeader": ["int", ["int"]],
		"indigoCmlAppend": ["int", ["int", "int"]],
		"indigoCmlFooter": ["int", ["int"]],
		"indigoAppend": ["int", ["int", "int"]],
		"indigoArrayAdd": ["int", ["int", "int"]],
		"indigoAt": ["int", ["int", "int"]],
		"indigoCount": ["int", ["int"]],
		"indigoClear": ["int", ["int"]],
		"indigoIterateArray": ["int", ["int"]],
		"indigoIgnoreAtom": ["int", ["int", "int"]],
		"indigoUnignoreAtom": ["int", ["int", "int"]],
		"indigoUnignoreAllAtoms": ["int", ["int"]],
		"indigoMatch": ["int", ["int", "int"]],
		"indigoCountMatches": ["int", ["int", "int"]],
		"indigoCountMatchesWithLimit": ["int", ["int", "int", "int"]],
		"indigoIterateMatches": ["int", ["int", "int"]],
		"indigoHighlightedTarget": ["int", ["int"]],
		"indigoMapAtom": ["int", ["int", "int"]],
		"indigoMapBond": ["int", ["int", "int"]],
		"indigoMapMolecule": ["int", ["int", "int"]],
		"indigoAllScaffolds": ["int", ["int"]],
		"indigoDecomposedMoleculeScaffold": ["int", ["int"]],
		"indigoIterateDecomposedMolecules": ["int", ["int"]],
		"indigoDecomposedMoleculeHighlighted": ["int", ["int"]],
		"indigoDecomposedMoleculeWithRGroups": ["int", ["int"]],
		"indigoDecomposeMolecule": ["int", ["int", "int"]],
		"indigoIterateDecompositions": ["int", ["int"]],
		"indigoAddDecomposition": ["int", ["int", "int"]],
		"indigoToString": ["string", ["int"]],
		"indigoToBuffer": ["int", ["int", ref.refType(ref.refType('byte')), ref.refType('int')]],
		"indigoStereocenterPyramid": [ref.refType('int'), ["int"]],
		"indigoExpandAbbreviations": ["int", ["int"]],
		"indigoDbgInternalType": ["string", ["int"]],
		"indigoOneBitsList": ["string", ["int"]],
		"indigoLoadMoleculeFromString": ["int", ["string"]],
		"indigoLoadMoleculeFromFile": ["int", ["string"]],
		"indigoLoadQueryMoleculeFromString": ["int", ["string"]],
		"indigoLoadQueryMoleculeFromFile": ["int", ["string"]],
		"indigoLoadSmartsFromString": ["int", ["string"]],
		"indigoLoadSmartsFromFile": ["int", ["string"]],
		"indigoLoadReactionFromString": ["int", ["string"]],
		"indigoLoadReactionFromFile": ["int", ["string"]],
		"indigoLoadQueryReactionFromString": ["int", ["string"]],
		"indigoLoadQueryReactionFromFile": ["int", ["string"]],
		"indigoLoadReactionSmartsFromString": ["int", ["string"]],
		"indigoLoadReactionSmartsFromFile": ["int", ["string"]],
		"indigoCreateReaction": ["int", []],
		"indigoCreateQueryReaction": ["int", []],
		"indigoExactMatch": ["int", ["int", "int", "string"]],
		"indigoSetTautomerRule": ["int", ["int", "string", "string"]],
		"indigoRemoveTautomerRule": ["int", ["int"]],
		"indigoClearTautomerRules": ["int", []],
		"indigoUnserialize": ["int", [ref.refType('byte'), "int"]],
		"indigoCommonBits": ["int", ["int", "int"]],
		"indigoSimilarity": ["float", ["int", "int", "string"]],
		"indigoIterateSDFile": ["int", ["string"]],
		"indigoIterateRDFile": ["int", ["string"]],
		"indigoIterateSmilesFile": ["int", ["string"]],
		"indigoIterateCMLFile": ["int", ["string"]],
		"indigoIterateCDXFile": ["int", ["string"]],
		"indigoCreateFileSaver": ["int", ["string", "string"]],
		"indigoCreateSaver": ["int", ["int", "string"]],
		"indigoCreateArray": ["int", []],
		"indigoSubstructureMatcher": ["int", ["int", "string"]],
		"indigoExtractCommonScaffold": ["int", ["int", "string"]],
		"indigoDecomposeMolecules": ["int", ["int", "int"]],
		"indigoCreateDecomposer": ["int", ["int"]],
		"indigoReactionProductEnumerate": ["int", ["int", "int"]],
		"indigoTransform": ["int", ["int", "int"]],
		"indigoLoadBuffer": ["int", [refArray('byte'), "int"]],
		"indigoLoadString": ["int", ["string"]],
		"indigoIterateSDF": ["int", ["int"]],
		"indigoIterateSmiles": ["int", ["int"]],
		"indigoIterateCML": ["int", ["int"]],
		"indigoIterateCDX": ["int", ["int"]],
		"indigoIterateRDF": ["int", ["int"]],
		"indigoWriteFile": ["int", ["string"]],
		"indigoIterateTautomers": ["int", ["int", "string"]]
	});
	// Allocate a new session. Each session has its own
	// set of objects created and options set up.
	this._sid = this._lib.indigoAllocSessionId();
	this.NOT_CENTER = -1;
	this.UNMARKED = 0;
	this.CENTER = 1;
	this.UNCHANGED = 2;
	this.MADE_OR_BROKEN = 4;
	this.ORDER_CHANGED = 8;
	this.ABS = 1;
	this.OR = 2;
	this.AND = 3;
	this.EITHER = 4;
	this.UP = 5;
	this.DOWN = 6;
	this.CIS = 7;
	this.TRANS = 8;
	this.CHAIN = 9;
	this.RING = 10;
	this.ALLENE = 11;

	this.SINGLET = 101;
	this.DOUBLET = 102;
	this.TRIPLET = 103;
};

Indigo.NOT_CENTER = -1;
Indigo.UNMARKED = 0;
Indigo.CENTER = 1;
Indigo.UNCHANGED = 2;
Indigo.MADE_OR_BROKEN = 4;
Indigo.ORDER_CHANGED = 8;
Indigo.ABS = 1;
Indigo.OR = 2;
Indigo.AND = 3;
Indigo.EITHER = 4;
Indigo.UP = 5;
Indigo.DOWN = 6;
Indigo.CIS = 7;
Indigo.TRANS = 8;
Indigo.CHAIN = 9;
Indigo.RING = 10;
Indigo.ALLENE = 11;

Indigo.SINGLET = 101;
Indigo.DOUBLET = 102;
Indigo.TRIPLET = 103;
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
	this._lib.indigoSetSessionId(this._sid);
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
 * Check result
 *
 * @method _checkResult
 * @param {number} result
 */
Indigo.prototype._checkResult = function (result) {
	if (result < 0)
		throw new IndigoException(this.getLastError());
	return result;
};

/*
 * Check result
 *
 * @method _checkResultFloat
 * @param {number} result
 */
Indigo.prototype._checkResultFloat = function (result) {
	if (result < -0.5)
		throw new IndigoException(this.getLastError());
	return result;
};

/*
 * Check string result
 *
 * @method _checkResultString
 * @param {string} result
 */
Indigo.prototype._checkResultString = function (result) {
	if (typeof result !== 'string')
		throw new IndigoException(this.getLastError());
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
};

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
};

/*
 * Load reaction from string
 *
 * @method loadReaction
 * @param {string} string reprsantation of molecule or a specification in form of a line notation for describing the structure of chemical species using short ASCII strings.
 * @return {object} IndigoObject
 */
Indigo.prototype.loadReaction = function (string) {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoLoadReactionFromString(string)));
};

/*
 * Load query molecule from string
 *
 * @method loadQueryMolecule
 * @param {string} string reprsantation of query molecule or a specification in form of a line notation for describing the structure of chemical species using short ASCII strings.
 * @return {object} IndigoObject
 */
Indigo.prototype.loadQueryMolecule = function (string) {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoLoadQueryMoleculeFromString(string)));
};

/*
 * Load query molecule from file
 *
 * @method loadQueryMoleculeFromFile
 * @param {string} filename of chemical format of molecule.
 * @return {object} IndigoObject
 */
Indigo.prototype.loadQueryMoleculeFromFile = function (filename) {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoLoadQueryMoleculeFromFile(filename)));
};

/*
 * Load molecule from file
 *
 * @method loadMoleculeFromFile
 * @param {string} filename of chemical format of molecule.
 * @return {object} IndigoObject
 */
Indigo.prototype.loadMoleculeFromFile = function (filename) {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoLoadMoleculeFromFile(filename)));
};

/*
 * Load molecular pattern from SMARTS string format
 *
 * @method loadSmarts
 * @param {string} a particular pattern (subgraph) in a molecule (graph)
 * @return {object} IndigoObject
 */
Indigo.prototype.loadSmarts = function (string) {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoLoadSmartsFromString(string)));
};

/*
 * Load molecular pattern from file which contains SMARTS string format
 *
 * @method loadSmartsFromFile
 * @param {string} a particular pattern (subgraph) in a molecule (graph)
 * @return {object} IndigoObject
 */
Indigo.prototype.loadSmartsFromFile = function (filename) {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoLoadSmartsFromFile(filename)));
};

/*
 *  Substructure matching
 *
 * @method substructureMatcher
 * @param {object} target is IndigoObject
 * @param {string} 'mode' is reserved for future use; currently its value is ignored
 * @return {object} a new 'matcher' object
 */
Indigo.prototype.substructureMatcher = function (target, mode) {
	this._setSessionId();
	if (mode === undefined || mode === null) {
		mode = '';
	}
	return new IndigoObject(this, this._checkResult(this._lib.indigoSubstructureMatcher(target.id, mode)), target);
};

/*
 *
 *
 * @method unserialize
 * @param {array}
 * @return {object} a new indigo object
 */
Indigo.prototype.unserialize = function (array) {
	this._setSessionId();
	var buf = new Buffer(array);
	var pointer = ref.alloc(ref.refType('byte'), buf);
	var res = this._lib.indigoUnserialize(pointer.deref(), buf.length);
	return new IndigoObject(this, this._checkResult(res));
};

/*
 *
 *
 * @method writeBuffer
 * @return {object} a new indigo object
 */
Indigo.prototype.writeBuffer = function () {
	this._setSessionId();
	var id = this._checkResult(this._lib.indigoWriteBuffer());
	return new IndigoObject(this, id);
};


/*
 *
 *
 * @method writeBuffer
 * @return {object} a new indigo object
 */
Indigo.prototype.writeFile = function (filename) {
	this._setSessionId();
	var id = this._checkResult(this._lib.indigoWriteFile(filename));
	return new IndigoObject(this, id);
};

/*
 *
 *
 * @method loadBuffer
 * @return {object} a new indigo object
 */
Indigo.prototype.loadBuffer = function (buf) {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoLoadBuffer(buf, buf.length)));
};

/*
 *
 *
 * @method createMolecule
 * @return {object} a new indigo object
 */
Indigo.prototype.createMolecule = function () {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoCreateMolecule()));
};

/*
 *
 *
 * @method createQueryMolecule
 * @return {object} a new indigo object
 */
Indigo.prototype.createQueryMolecule = function () {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoCreateQueryMolecule()));
};

/*
 *
 *
 * @method createReaction
 * @return {object} a new indigo object
 */
Indigo.prototype.createReaction = function () {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoCreateReaction()));
};


/*
 *
 *
 * @method createQueryReaction
 * @return {object} a new indigo object
 */
Indigo.prototype.createQueryReaction = function () {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoCreateReaction()));
};

/*
 *
 *
 * @method createSaver
 * @param {object}
 * @param {string} format
 * @return {object} a new indigo object
 */
Indigo.prototype.createSaver = function (obj, format) {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoCreateSaver(obj.id, format)));
};

/*
 *
 *
 * @method loadString
 * @param {string}
 * @return {object} a new indigo object
 */
Indigo.prototype.loadString = function (string) {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoLoadString(string)));
};

/*
 *
 *
 * @method iterateSDFile
 * @param {object}
 * @return {object} a new indigo object
 */
Indigo.prototype.iterateSDFile = function* (filename) {
	this._setSessionId();
	var molfile = new IndigoObject(this, this._checkResult(this._lib.indigoIterateSDFile(filename)));
	var newobj = molfile;
	while (newobj && newobj.id !== -1) if (newobj = molfile._next()) yield newobj;
};

/*
 *
 *
 * @method iterateRDFile
 * @param {object}
 * @return {object} a new indigo object
 */
Indigo.prototype.iterateRDFile = function* (filename) {
	this._setSessionId();
	var rdf = new IndigoObject(this, this._checkResult(this._lib.indigoIterateRDFile(filename)));
	var newobj = rdf;
	while (newobj && newobj.id !== -1) if (newobj = rdf._next()) yield newobj;
};

/*
 *
 *
 * @method iterateSmilesFile
 * @param {object}
 * @return {object} a new indigo object
 */
Indigo.prototype.iterateSmilesFile = function* (filename) {
	this._setSessionId();
	var smile = new IndigoObject(this, this._checkResult(this._lib.indigoIterateSmilesFile(filename)));
	var newobj = smile;
	while (newobj && newobj.id !== -1) if (newobj = smile._next()) yield newobj;
};

/*
 *
 *
 * @method iterateCMLFile
 * @param {object}
 * @return {object} a new indigo object
 */
Indigo.prototype.iterateCMLFile = function* (filename) {
	this._setSessionId();
	var cml = new IndigoObject(this, this._checkResult(this._lib.indigoIterateCMLFile(filename)));
	var newobj = cml;
	while (newobj && newobj.id !== -1) if (newobj = cml._next()) yield newobj;
};

/*
 *
 *
 * @method iterateCDXFile
 * @param {object}
 * @return {object} a new indigo object
 */
Indigo.prototype.iterateCDXFile = function* (filename) {
	this._setSessionId();
	var cdx = new IndigoObject(this, this._checkResult(this._lib.indigoIterateCDXFile(filename)));
	var newobj = cdx;
	while (newobj && newobj.id !== -1) if (newobj = cdx._next()) yield newobj;
};

/*
 *
 *
 * @method iterateSDF
 * @param {object}
 * @return {object} a new indigo object
 */
Indigo.prototype.iterateSDF = function* (reader) {
	this._setSessionId();
	var molfile = new IndigoObject(this, this._checkResult(this._lib.indigoIterateSDF(reader.id)), reader);
	var newobj = molfile;
	while (newobj && newobj.id !== -1) if (newobj = molfile._next()) yield newobj;
};

/*
 *
 *
 * @method iterateSmiles
 * @param {object}
 * @return {object} a new indigo object
 */
Indigo.prototype.iterateSmiles = function* (reader) {
	this._setSessionId();
	var smile = new IndigoObject(this, this._checkResult(this._lib.indigoIterateSmiles(reader.id)), reader);
	var newobj = smile;
	while (newobj && newobj.id !== -1) if (newobj = smile._next()) yield newobj;
};

/*
 *
 *
 * @method iterateCML
 * @param {object}
 * @return {object} a new indigo object
 */
Indigo.prototype.iterateCML = function* (reader) {
	this._setSessionId();
	var cml = new IndigoObject(this, this._checkResult(this._lib.indigoIterateCML(reader.id)), reader);
	var newobj = cml;
	while (newobj && newobj.id !== -1) if (newobj = cml._next()) yield newobj;
};

/*
 *
 *
 * @method iterateRDF
 * @param {object}
 * @return {object} a new indigo object
 */
Indigo.prototype.iterateRDF = function* (reader) {
	this._setSessionId();
	var rdf = new IndigoObject(this, this._checkResult(this._lib.indigoIterateRDF(reader.id)), reader);
	var newobj = rdf;
	while (newobj && newobj.id !== -1) if (newobj = rdf._next()) yield newobj;
};

/*
 *
 *
 * @method iterateCDX
 * @param {object}
 * @return {object} a new indigo object
 */
Indigo.prototype.iterateCDX = function* (reader) {
	this._setSessionId();
	var cdx = new IndigoObject(this, this._checkResult(this._lib.indigoIterateCDX(reader.id)), reader);
	var newobj = cdx;
	while (newobj && newobj.id !== -1)
		if (newobj = cdx._next()) yield newobj;
};

/*
 *
 *
 * @method iterateTautomers
 * @param {object}
 * @return {object} a new indigo object
 */
Indigo.prototype.iterateTautomers = function* (molecule, params) {
	this._setSessionId();
	var tau = new IndigoObject(this, this._checkResult(this._lib.indigoIterateTautomers(molecule.id, params)), molecule);
	var newobj = tau;
	while (newobj && newobj.id !== -1)
		if (newobj = tau._next()) yield newobj;
};

/*
 *
 *
 * @method createFileSaver
 * @param {string} filename
 * @param {string} format
 * @return {object} a new indigo object
 */
Indigo.prototype.createFileSaver = function (filename, format) {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoCreateFileSaver(filename, format)));
};

/*
 *
 *
 * @method createSaver
 * @param {object} obj
 * @param {string} format
 * @return {object} a new indigo object
 */
Indigo.prototype.createSaver = function (obj, format) {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoCreateSaver(obj.id, format)));
};

/*
 *
 *
 * @method createArray
 * @return {object} a new indigo object
 */
Indigo.prototype.createArray = function () {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoCreateArray()));
};


Indigo.prototype.loadQueryReaction = function (string) {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoLoadQueryReactionFromString(string)));
};

Indigo.prototype.loadQueryReactionFromFile = function (filename) {
	this._setSessionId();
	return new IndigoObject(this, this._checkResult(this._lib.indigoLoadQueryReactionFromFile(filename)));
};

/*
 * Set Option
 *
 * @method setOption
 * @param {string} name of option.
 * @param {number or string or boolean} value of option.
 * @return {boolean} return true if option applies as successful
 */
Indigo.prototype.setOption = function (option, value1, value2, value3) {
	this._setSessionId();
	var ret = -1;
	var value2 = value2 || 0;
	var value3 = value3 || 0;
	if (!value2) {
		switch (typeof value1) {
			case 'string':
				ret = this._checkResult(this._lib.indigoSetOption(option, value1));
				break;
			case 'number':
				{
					if (/^[0-9]+$/.test(String(value1)))
						ret = this._checkResult(this._lib.indigoSetOptionInt(option, value1));
					else
						ret = this._checkResult(this._lib.indigoSetOptionFloat(option, value1));
				}
				break;
			case 'boolean':
				var value1_b = (value1)?1:0;
				ret = this._checkResult(this._lib.indigoSetOptionBool(option, value1_b));
				break;
			default:
				throw IndigoException("bad option");
		}
	}
	else {
		if (typeof value1 === 'number' && typeof value2 === 'number') {
			if ((/^[0-9]+$/.test(String(value1))) && (/^[0-9]+$/.test(String(value2))))
				ret = this._checkResult(this._lib.indigoSetOptionXY(option, value1, value2));
			else
				throw IndigoException("bad option");
		}
		if (typeof value1 === 'number' && typeof value2 === 'number' && typeof value3 === 'number') {
			if (!(/^[0-9]+$/.test(String(value1))) && !(/^[0-9]+$/.test(String(value2))) && !(/^[0-9]+$/.test(String(value3))))
				ret = this._checkResult(this._lib.indigoSetOptionColor(option, value1, value2, value3));
			else
				throw IndigoException("bad option");
		}
	}
	return (ret === 1);
};

module.exports = {
	Indigo: Indigo,
	IndigoObject: IndigoObject,
	IndigoException: IndigoException
};

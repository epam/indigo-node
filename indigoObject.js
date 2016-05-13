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
 * has an next object
 * 
 * @method hasNext
 * @returns {number}  
 */
IndigoObject.prototype.hasNext = function () {
	this.d._setSessionId();
	return (this.d._checkResult(this.d._lib.indigoHasNext(this.id)) == 1)
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
	var xyz_ptr = this.d._lib.indigoXYZ(this.id); /* int atom */
	if (xyz_ptr.length == 0) {
		var msg = this.d.getLastError();
		this.d.logger.error('xyz [fault]: ' + msg);
		return [0.0, 0.0, 0.0];
	}
	
	var xyz = xyz_ptr.deref();
	return [xyz.x, xyz.y, xyz.z];
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
 * @method index
 * @returns {object}  
 */
IndigoObject.prototype.index = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoIndex(this.id));
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
	var size = this.d._out.aint; // allocate a 4-byte (32-bit) chunk for the output value
	var pointer = this.d._out.apbyte;
	var status = this.d._checkResult(this.d._lib.indigoSerialize(this.id, pointer, size));
	var buf = this.d._out.read(pointer, 0, size.deref());
	var res = [];
	for (i = 0; i < size.deref(); i++) {
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
	var value = this.d._out.aint;
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
	var value = this.d._out.aint;
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
 * @method index
 * @returns {number}  
 */
IndigoObject.prototype.index = function () {
	this.d._setSessionId();
	return this.d._checkResult(this.d._lib.indigoIndex(this.id));
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
		options = '';
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
	var size = this.d._out.aint;
	var pointer = this.d._out.apbyte;
	var status = this.d._checkResult(this.d._lib.indigoToBuffer(this.id, pointer, size));
	var buf = this.d._out.read(pointer, 0, size.deref());
	var res = [];
	for (i = 0; i < size.deref(); i++) {
		res.push(buf[i]);
	}
	return res;
};


module.exports = IndigoObject;

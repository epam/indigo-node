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
var refArray = require('ref-array');
var refStruct = require('ref-struct');

var IndigoObject = require('./indigoObject');
var IndigoException = require('./indigoException');

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
	var qword = ('win32' == process.platform) ? 'uint64' : 'ulonglong';

	this._lib = ffi.Library(libpath, {
		"indigoSetOption" : ["int", ["string", "string"]],
		"indigoSetOptionInt" : ["int", ["string", "int"]],
		"indigoSetOptionBool" : ["int", ["string", "int"]],
		"indigoSetOptionFloat" : ["int", ["string", "float"]],
		"indigoSetOptionColor" : ["int", ["string", "float", "float", "float"]],
		"indigoSetOptionXY" : ["int", ["string", "int", "int"]],
		"indigoDbgBreakpoint": ["void", []],
		"indigoVersion": ["string", []],
		"indigoAllocSessionId": [qword, []],
		"indigoSetSessionId": ["void", [qword]],
		"indigoReleaseSessionId": ["void", [qword]],
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
	this._out = {
		"aint": ref.alloc('int'),
		"afloat": ref.alloc('float'),
		"apbyte": ref.alloc(ref.refType('byte')),
		"read": ref.readPointer,
		"alloc": ref.alloc
	};
	this._type = {
		"byte_ptr": ref.refType('byte')
	};
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
	var pointer = this._out.alloc(this._type.byte_ptr, buf);
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

module.exports = Indigo;

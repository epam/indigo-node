/* declaration of modules  */
var assert = require('assert');
var indigo = require("../indigo");
var IndigoObject = require("../indigoObject");

console.log(indigo.getVersion());


describe('Test loadMokecule from stream', function () {
	it('should return IndigoObject', function (){
assert.equal(true, indigo.loadMolecule("COC1=CC2=C(NC(=C2)C(O)(CC2=CN=CC=C2)CC2=CN=CC=C2)C=C1") instanceof IndigoObject);
assert.equal(1, indigo.countReferences());
assert.equal(true, indigo.loadMolecule("COC1=CC2=C(NC(=C2)C(O)(CC2=CN=CC=C2)CC2=CN=CC=C2)C=C1").clone() instanceof IndigoObject);
assert.equal(3, indigo.countReferences());
indigo._setSessionId();
indigo._releaseSessionId();
assert.equal(0, indigo.countReferences());
	});
});


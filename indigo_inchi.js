/****************************************************************************
 * Copyright (C) from 2015 to Present EPAM Systems.
 *
 * This file is part of Indigo-Node binding.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/
import { join } from 'path';
import { Library } from 'ffi-napi';

import { IndigoObject } from './indigo';

let IndigoInchi = function(indigo) {
    this.indigo = indigo;
    let libpath = join(indigo.dllpath,
        process.platform !== 'win32' ? 'libindigo-inchi' : 'indigo-inchi');

    this._lib = Library(libpath, {
        indigoInchiVersion: ['string', []],
        indigoInchiResetOptions: ['int', []],
        indigoInchiLoadMolecule: ['int', ['string']],
        indigoInchiGetInchi: ['string', ['int']],
        indigoInchiGetInchiKey: ['string', ['string']],
        indigoInchiGetWarning: ['string', []],
        indigoInchiGetLog: ['string', []],
        indigoInchiGetAuxInfo: [' string', []],
    });
};

/*
 *
 * @method version
 * @return {string} string of version
 */
IndigoInchi.prototype.version = function() {
    this.indigo._setSessionId();
    return this._lib.indigoInchiVersion();
};

/*
 *
 * @method resetOptions
 * @return {boolean} return true if option applies as successful
 */
IndigoInchi.prototype.resetOptions = function() {
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
IndigoInchi.prototype.loadMolecule = function(inchi) {
    this.indigo._setSessionId();
    return new IndigoObject(this.indigo, this.indigo._checkResult(this._lib.indigoInchiLoadMolecule(inchi)));
};

/*
 *
 * @method getInchi
 * @param {object}
 * @return {string}
 */
IndigoInchi.prototype.getInchi = function(molecule) {
    this.indigo._setSessionId();
    return this.indigo._checkResultString(this._lib.indigoInchiGetInchi(molecule.id));
};

/*
 *
 * @method getWarning
 * @return {string}
 */
IndigoInchi.prototype.getWarning = function() {
    this.indigo._setSessionId();
    return this.indigo._checkResultString(this._lib.indigoInchiGetWarning());
};

/*
 *
 * @method getInchiKey
 * @return {string}
 */
IndigoInchi.prototype.getInchiKey = function(inchi) {
    this.indigo._setSessionId();
    return this.indigo._checkResultString(this._lib.indigoInchiGetInchiKey(inchi));
};

/*
 *
 * @method getLog
 * @return {string}
 */
IndigoInchi.prototype.getLog = function() {
    this.indigo._setSessionId();
    return this.indigo._checkResultString(this._lib.indigoInchiGetLog());
};

/*
 *
 * @method getAuxInfo
 * @return {string}
 */
IndigoInchi.prototype.getAuxInfo = function() {
    this.indigo._setSessionId();
    return this.indigo._checkResultString(this._lib.indigoInchiGetAuxInfo());
};

export default IndigoInchi;

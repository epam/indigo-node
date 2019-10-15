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
import refArray from 'ref-array-napi';

import { IndigoException } from './indigo';

let IndigoRenderer = function(indigo) {
    this.indigo = indigo;
    const libpath = join(indigo.dllpath, process.platform !== 'win32' ? 'libindigo-renderer' : 'indigo-renderer');

    this._lib = Library(libpath, {
        indigoRender: ['int', ['int', 'int']],
        indigoRenderToFile: ['int', ['int', 'string']],
        indigoRenderGrid: ['int', ['int', refArray('int'), 'int', 'int']],
        indigoRenderGridToFile: ['int', ['int', refArray('int'), 'int', 'string']],
        indigoRenderReset: ['int', []],
    });
};

/*
 *
 * @method renderToBuffer
 * @param {object} obj is IndigoObject
 * @returns {Array}
 */
IndigoRenderer.prototype.renderToBuffer = function(obj) {
    this.indigo._setSessionId();
    let wb = this.indigo.writeBuffer();
    try {
        this.indigo._checkResult(this._lib.indigoRender(obj.id, wb.id));
        return wb.toBuffer();
    } finally {
        wb.dispose();
    }
};

/*
 *
 * @method renderToFile
 * @param {object} obj is IndigoObject
 * @param {string} filename
 * @return {boolean} return true if file have been saved successfully
 */
IndigoRenderer.prototype.renderToFile = function(obj, filename) {
    this.indigo._setSessionId();
    return (this.indigo._checkResult(this._lib.indigoRenderToFile(obj.id, filename)) === 1);
};

/*
 *
 * @method renderReset
 * @return {boolean} return true if reset have been done successfully
 */
IndigoRenderer.prototype.renderReset = function() {
    this.indigo._setSessionId();
    return (this.indigo._checkResult(this._lib.indigoRenderReset()) === 1);
};

/*
 *
 * @method renderGridToFile
 * @param {object} objects  is an array of molecules created with indigoCreateArray
 * @param {array} refatoms is an array of integers, whose size must be equal to the number of molecules if the array
 * @param {number} ncolumns is the number of columns in the grid
 * @param {string} filename
 */
IndigoRenderer.prototype.renderGridToFile = function(objects, refatoms, ncolumns, filename) {
    this.indigo._setSessionId();
    let arr = null;
    if (refatoms) {
        if (refatoms.length !== objects.count())
            throw new IndigoException('renderGridToFile(): refatoms[] size must be equal to the number of objects');
        // TODO: check python conformance
        arr = refatoms;
    }
    this.indigo._checkResult(this._lib.indigoRenderGridToFile(objects.id, arr, ncolumns, filename));
};

/*
 *
 * @method renderGridToBuffer
 * @param {object} objects  is an array of molecules created with indigoCreateArray
 * @param {array} refatoms is an array of integers, whose size must be equal to the number of molecules if the array
 * @param {number} ncolumns is the number of columns in the grid
 */
IndigoRenderer.prototype.renderGridToBuffer = function(objects, refatoms, ncolumns) {
    this.indigo._setSessionId();
    let arr = null;
    if (refatoms) {
        if (refatoms.length !== objects.count())
            throw new IndigoException('renderGridToBuffer(): refatoms[] size must be equal to the number of objects');

        // TODO: check python conformance
        arr = refatoms;
    }
    let wb = this.indigo.writeBuffer();

    try {
        this.indigo._checkResult(this._lib.indigoRenderGrid(objects.id, arr, ncolumns, wb.id));
        return wb.toBuffer();
    } finally {
        wb.dispose();
    }
};

export default IndigoRenderer;

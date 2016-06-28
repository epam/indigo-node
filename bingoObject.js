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

var ref = require('ref');
var IndigoObject = require('./indigoObject');

var BingoObject = function (id, indigo, bingo) {
	this.id = id;
	this.indigo = indigo;
	this.bingo = bingo;
};

/*
 * Close an object
 *
 * @method close
 * @returns {number}
 */
BingoObject.prototype.close = function () {
	this.indigo._setSessionId();
	var res;
	if (this.id >= 0) {
		res = this.indigo._checkResult(this.bingo._lib.bingoEndSearch(this.id));
		this.id = -1;
	}
	return true;
};


/*
 * next
 *
 * @method next
 * @returns {boolean}
 */
BingoObject.prototype.next = function () {
	this.indigo._setSessionId();
	return (this.indigo._checkResult(this.bingo._lib.bingoNext(this.id)) == 1);
};

/*
 * next
 *
 * @method getCurrentId
 * @returns {number} id
 */
BingoObject.prototype.getCurrentId = function () {
	this.indigo._setSessionId();
	return this.indigo._checkResult(this.bingo._lib.bingoGetCurrentId(this.id));
};

/*
 *
 * @method getIndigoObject
 * @returns {object} IndigoObject
 */
BingoObject.prototype.getIndigoObject = function () {
	this.indigo._setSessionId();
	return new IndigoObject(this.indigo, this.indigo._checkResult(this.bingo._lib.bingoGetObject(this.id)));
};

/*
 *
 * @method getCurrentSimilarityValue
 * @returns {number}
 */
BingoObject.prototype.getCurrentSimilarityValue = function () {
	this.indigo._setSessionId();
	return this.indigo._checkResult(this.bingo._lib.bingoGetCurrentSimilarityValue(this.id));
};

/*
 *
 * @method estimateRemainingResultsCount
 * @returns {number}
 */
BingoObject.prototype.estimateRemainingResultsCount = function () {
	this.indigo._setSessionId();
	return this.indigo._checkResult(this.bingo._lib.bingoEstimateRemainingResultsCount(this.id));
};

/*
 *
 * @method estimateRemainingResultsCountError
 * @returns {number}
 */
BingoObject.prototype.estimateRemainingResultsCountError = function () {
	this.indigo._setSessionId();
	return this.indigo._checkResult(this.bingo._lib.bingoEstimateRemainingResultsCountError(this.id));
};

/*
 *
 * @method estimateRemainingTime
 * @returns {number}
 */
BingoObject.prototype.estimateRemainingTime = function () {
	this.indigo._setSessionId();
	var value = ref.alloc('float');
	var res = this.indigo._checkResult(this.bingo._lib.bingoEstimateRemainingTime(this.id, value));
	if (res === null)
		return null;
	else
		return value.deref();
};

module.exports = BingoObject;

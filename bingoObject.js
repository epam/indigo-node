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

BingoObject = function (id, indigo, bingo) {
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

module.exports = BingoObject;

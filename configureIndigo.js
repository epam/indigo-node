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

module.exports = {
	//platform
	win32: {
		libs:{
			'indigo':'indigo',
			'bingo':'bingo',
			'indigo-inchi':'indigo-inchi',
			'indigo-renderer':'indigo-renderer'
		}
	},
	linux:{
		libs:{
			'indigo':'libindigo',
			'bingo':'libbingo',
			'indigo-inchi':'libindigo-inchi',
			'indigo-renderer':'libindigo-renderer'
		}
	}
};

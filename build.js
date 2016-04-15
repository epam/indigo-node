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

var cp = require('child_process');
var path = require('path');

var local = path.join.bind(path, __dirname);

var config = require(local('configureIndigo'));

module.exports = function BuildLib() {

  return new Promise(function(resolve, reject) {
    cp.exec('python '+ local('Indigo/build_scripts/indigo-release-libs.py')+' '+config[process.platform].flag[process.arch], function(err, stdout, stderr) {
      if (err) {
        console.error(stderr);
        reject(err, stderr);
      }
      else {
        resolve();
        console.info(stdout);
      }
    });
  }).then(function() {
		var fs = require('fs');
		var fse = require('fs-extra');
		fse.copy(config[process.platform].copy.src, config[process.platform].copy.dest, function (err) {
			if (err) return console.error(err)
			console.log('success!')
			if (process.platform === 'win32') {
				fs.access(local('/shared/Win'), fs.R_OK | fs.W_OK, function (err) {
					if (err) return console.error(err)
					//				console.log(err ? 'no access!' : 'can read/write');
					fse.move(local('/shared/Win'), local('/shared/win32'), function (err) {
						if (err) return console.error(err)
//					console.log("success!")
					}); // copies file

				});
			}
			if (process.platform === 'linux') {
				fs.access(local('/shared/Linux'), fs.R_OK | fs.W_OK, function (err) {
					if (err) return console.error(err)
					//				console.log(err ? 'no access!' : 'can read/write');
					fse.move(local('/shared/Linux'), local('/shared/linux'), function (err) {
						if (err) return console.error(err)
//					console.log("success!")
					}); // copies file

				});
			}
		}); // copies file
  });
};

// Called on the command line
if (require.main === module) {
  module.exports();
}
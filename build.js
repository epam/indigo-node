var cp = require("child_process");
var path = require("path");

var local = path.join.bind(path, __dirname);

var config = require(local("configureIndigo"));

module.exports = function BuildLib() {

  return new Promise(function(resolve, reject) {
    cp.exec("python "+ local("Indigo/build_scripts/indigo-release-libs.py")+" "+config[process.platform].flag[process.arch], function(err, stdout, stderr) {
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
//			console.log("success!")
		}); // copies file
		if (process.platform === "win32") {
			fs.access(local('/shared/Win'), fs.R_OK | fs.W_OK, function (err) {
				if (err) return console.error(err)
//				console.log(err ? 'no access!' : 'can read/write');
				fse.move(local('/shared/Win'), local('/shared/win32'), function (err) {
					if (err) return console.error(err)
//					console.log("success!")
				}); // copies file

			});
		}
  });
};

// Called on the command line
if (require.main === module) {
  module.exports();
}
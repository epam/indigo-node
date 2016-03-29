var path = require("path");
var local = path.join.bind(path, __dirname);

module.exports = {
	//platform
	win32: {
		flag: {
			'x64': '--preset=win64-2013', //architecture
			'x32': '--preset=win32-2013'
		},
		copy: {
			src: local('Indigo/api/libs/shared'),
			dest: local('shared')

		}
	}
};

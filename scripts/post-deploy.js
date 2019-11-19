const buildDir = './dist';
const fs = require('fs-extra');

fs.copySync('./package.prod.json', buildDir + '/package.json');
fs.copySync('./server/config.env', buildDir + '/config.env');

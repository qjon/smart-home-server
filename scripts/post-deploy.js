const buildDir = './dist';
const certsDir = 'certs';
const fs = require('fs-extra');

fs.copySync('./server/' + certsDir, buildDir + '/' + certsDir);
fs.copySync('./package.prod.json', buildDir + '/package.json');
fs.copySync('./server/config.env', buildDir + '/config.env');

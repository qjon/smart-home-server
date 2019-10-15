const frontendDir = 'smart-home';
const buildDir = 'dist';
const certsDir = 'certs';

const fs = require('fs-extra');

console.log('Move FE app');
fs.renameSync(frontendDir, buildDir + '/' + frontendDir);

console.log('Move Certs');
fs.copySync(certsDir, buildDir + '/' + certsDir);

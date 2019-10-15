const frontendDir = 'smart-home';

const fs = require('fs-extra');


console.log('Empty FE dir');
fs.emptyDirSync(frontendDir);

fs.ensureDirSync(frontendDir);

const git = require('simple-git')(frontendDir);

console.log('Clone repo');
git.clone('git@github.com:qjon/smart-home.git', './');

console.log('Copy Environment configuration');

fs.copySync('scripts/environment-smart-home.ts', frontendDir + '/src/environments/environment.ts');
fs.copySync('scripts/environment-smart-home.ts', frontendDir + '/src/environments/environment.prod.ts');

console.log('Install all deps and build');

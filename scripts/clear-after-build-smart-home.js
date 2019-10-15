const frontendDir = 'smart-home';
const frontendDirBuild = 'smart-home-buil';

const fs = require('fs-extra');

console.log('Remove all necessary directories');

fs.renameSync(frontendDir + '/dist/smart-home', frontendDirBuild);

fs.emptyDirSync(frontendDir);
fs.renameSync(frontendDirBuild, frontendDir);

const replace = require('replace-in-file');
const moment = require('moment');
const buildDate = moment(new Date()).format("Y-MM-DD HH:mm:ss");

const options = {
  files: [
    'app/src/environments/environment.ts',
    'app/src/environments/environment.prod.ts',
  ],
  from: /buildDate: '(.*)'/g,
  to: "buildDate: '" + buildDate + "'",
  allowEmptyPaths: false,
};
try {
  let changedFiles = replace.sync(options);
  if (changedFiles == 0) {
    throw "Please make sure that the file '" + options.files + "' has \"buildDate: ''\"";
  }
  console.log('Build timestamp is set to: ' + buildDate);
} catch (error) {
  console.error('Error occurred:', error);
  throw error
}

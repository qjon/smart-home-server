const readline = require('readline');
const fs = require('fs-extra');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Server IP? ', function(ip) {
  rl.question('API port? ', function(apiPort) {
    rl.question('HTTPS port? ', function(sslPort) {
      rl.question('Websocket port? ', function(websocketPort) {
        rl.question('DB host? ', function(dbHost) {
          rl.question('DB user? ', function(dbUser) {
            rl.question('DB pass? ', function(sbPass) {
              rl.question('DB schema? ', function(dbSchema) {
                const envDevString = 'export const environment = {\n' +
                  '  buildDate: \'\',\n' +
                  '  version: require(\'../../../package.json\').version,\n' +
                  '  production: false,\n' +
                  '  apiHost: \'http://' + ip + ':' + apiPort + '\',\n' +
                  '  ws: {\n' +
                  '    host: \'' + ip + '\',\n' +
                  '    port: \'' + websocketPort + '\'\n' +
                  '  }\n' +
                  '};\n';

                fs.writeFileSync(__dirname + '/../app/src/environments/environment.ts', envDevString, { encoding: 'utf8' });

                const envProdString = 'export const environment = {\n' +
                  '  buildDate: \'\',\n' +
                  '  version: require(\'../../../package.json\').version,\n' +
                  '  production: true,\n' +
                  '  apiHost: \'http://' + ip + ':' + apiPort + '\',\n' +
                  '  ws: {\n' +
                  '    host: \'' + ip + '\',\n' +
                  '    port: \'' + websocketPort + '\'\n' +
                  '  }\n' +
                  '};\n';

                fs.writeFileSync(__dirname + '/../app/src/environments/environment.prod.ts', envProdString, { encoding: 'utf8' });

                const envServer = '#IP\n' +
                  'IP=localhost\n' +
                  '##########################\n' +
                  '# Ports\n' +
                  'API_PORT=8080\n' +
                  'WEBSOCKET_PORT=8079\n' +
                  '##########################\n' +
                  '# Database\n' +
                  'DB_HOST=localhost\n' +
                  'DB_USER=smart\n' +
                  'DB_PASS=home\n' +
                  'DB_SCHEMA=smarthome\n' +
                  '##########################\n' +
                  'MAIL_USERNAME=\n' +
                  'MAIL_PASSWORD=\n' +
                  'MAIL_SMTP=\n' +
                  'MAIL_FROM=\n' +
                  'SEND_NOTIFICATIONS=false\n'
                ;

                fs.writeFileSync(__dirname + '/../server/config.env', envServer, { encoding: 'utf8' });


                rl.close();
              });
            });
          });
        });
      });
    });
  });
});

rl.on('close', function() {
  process.exit(0);
});

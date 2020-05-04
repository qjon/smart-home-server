import * as dotenv from 'dotenv';
import * as fs from 'fs';

console.log(process.argv);
const envConfig = dotenv.parse(fs.readFileSync(__dirname + '/config.env'));

export const environment = {
  database: {
    host: envConfig.DB_HOST,
    port: envConfig.DB_PORT,
    user: envConfig.DB_USER,
    password: envConfig.DB_PASS,
    name: envConfig.DB_SCHEMA,
  },
  server: {
    port: envConfig.SERVER_PORT,
  },
};

import * as dotenv from 'dotenv';
import * as fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync(__dirname + '/config.env'));

const runner: string = process.argv[1].split('/').pop();

export const environment = {
  database: {
    host: envConfig.DB_HOST,
    port: envConfig.DB_PORT,
    user: envConfig.DB_USER,
    password: envConfig.DB_PASS,
    name: envConfig.DB_SCHEMA + ((runner === 'jest') ? '_test': ''),
  },
  server: {
    port: envConfig.SERVER_PORT,
  },
};

import * as dotenv from 'dotenv';
import * as fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync(__dirname + '/../config.env'));

export const environment = {
  apiPort: envConfig.API_PORT,
  websocketsPort: envConfig.WEBSOCKET_PORT,
  ip: envConfig.IP,
  database: {
    host: envConfig.DB_HOST,
    user: envConfig.DB_USER,
    password: envConfig.DB_PASS,
    name: envConfig.DB_SCHEMA,
  },
  mail: {
    username: envConfig.MAIL_USERNAME,
    password: envConfig.MAIL_PASSWORD,
    smtp: envConfig.MAIL_SMTP,
    from: envConfig.MAIL_FROm,
    sendNotifications: envConfig.SEND_NOTIFICATIONS,
  },
};

import * as dotenv from 'dotenv';
import * as fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync(__dirname + '/config.env'));

export const environment = {
  database: {
    host: envConfig.DB_HOST,
    port: envConfig.DB_PORT,
    user: envConfig.DB_USER,
    password: envConfig.DB_PASS,
    name: envConfig.DB_SCHEMA,
  },
  mqtt: {
    host: envConfig.MQTT_HOST,
    port: envConfig.MQTT_PORT,
    user: envConfig.MQTT_USER,
    password: envConfig.MQTT_PASS,
    topic: envConfig.MQTT_TOPIC,
  },
};

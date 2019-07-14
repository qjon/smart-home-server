# smart-home-server

Simple server to manage SonOff devices.

## Change Log

### v0.8.1
* API allows to rename switch outlet
* Add licence

### v0.8.0
* works with SonOff light switches
* API allows to 
    * check status of device
    * rename device
    * change switch status of device

## ToDo:
* rename switch light buttons
* limit number of switches for each device
* scheduler
* anti-thief mode


## Requirements

* installed _mysql_ server
* installed _netstat_ on server
* creating self-sign SSL certificate 

## Installation

* Clone repo or download ZIP
* Install all deps
    
    
    npm i
    
* Create _src/environment.ts_ file

    
    export const environment = {
      apiPort: API_PORT,
      sslPort: SSL_PORT,
      websocketsPort: WEBSOCKET_PORT,
      ip: 'SERVER_IP',
      database: {
        host: 'DB_HOST',
        user: 'DB_USER',
        password: 'DB_PASS',
        name: 'DB_NAME',
      },
    };    

* Put self-sign SSL certificate files _server.crt_, _server.key_ in _cert_ directory
* Build project


    npm run build
    
* create frontend application using [smart-home](https://github.com/qjon/smart-home) and copy it to project root directory

* use _crontab/crontab.template.sh_ to create yours _crontab.sh_ file which will be run. Using crontab prevent before application crash. It will automatically UP the app when it crashed.

* in browser go to http://SERVER_IP:SSL_PORT, the app should start, but to see list of your devices you have to connected them to your local network (see instruction below)

## Connect light switch device to server

To connect your device to server you will need 

* computer with Postman or other software like it
* or mobile with Rest Api Client


Step by step procedure using mobile:
 
* Hold on any button for 5 sec to make WiFi light blinking on your SonOff device
* Now your device is in AP mode, you can now connect to your device 
* connect mobile phone to AP SonOff
* after connection you should be able to send request to your device via Rest Api Client
    
    
    POST: http://10.10.7.1/ap
    headers: Content-Type: application/json
    Body: {
            "version": 4,
            "ssid": "WIFI_NAME",
            "password": "WIFI_PASSWORD",
            "serverName": "SERVER_IP",
            "port": SSL_PORT
          }


* response should not return error and your device should disconnect your mobile and connect to your local network and server


[smart-home]: https://github.com/qjon/smart-home-server

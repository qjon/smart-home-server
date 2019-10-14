# smart-home-server

Simple server to manage SonOff devices.

## Change Log

### v1.0.0

* works with firmware 3.3.0+
* tested on devices T1 EU and S26E
* possibility to turn ON/OFF single switch
* possibility to turn ON all switches for device at once
* add new device functionality
* update device data 

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
* limit number of switches for each device
* scheduler
* anti-thief mode

## Issues
* In firmware 3.3.0 request to device is done, but there is a problem with response (currently I abort the request after 400ms). After such API call information about change is broadcast by the device so Application retrieve this information almost instantly and can react on it.


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

To connect your device to server you will need:
 
* API KEY and ID of device
* eWelink app 
* access to your home router

Step by step procedure using mobile:
 
* Hold on any button for 5 sec to make WiFi light blinking on your SonOff device
* Now your device is in AP mode, you can now connect to your device 
* connect mobile phone to AP SonOff
* after connection you should be able to send request to your device via Rest Api Client
    
    
    GET: http://10.10.7.1/ap
    headers: Content-Type: application/json

* response should not return error and you have been able to read device ID and API KEY (write down it, it will be necessary in next step)
* now using original eWelink app connect device via this app. When device is connected please upgrade firmware to 3.3.0+.
* check if device works via eWelink app
* enable _Lan Mode_
* on your router please disable internet connection for your device and assign to it static IP (it is not necessary but simplify your life - I did not do test for dynamic IP)
* check once again if everything works when Internet connection is disabled and only Lan Mode is enabled
* open this application and _Add device_ using previously written API_KEY and ID
* generally that's all, after few seconds device should update its information to server (if not please restart server app)
 


[smart-home]: https://github.com/qjon/smart-home-server

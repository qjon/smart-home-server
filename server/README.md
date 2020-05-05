# Smart Home Server

This is a server application to store and serve device and weather stations data

It contains three applications:

- __smart-home-server__ - previously existing server application which serve API for whole Angular app
- __weather-stations-microservice__ - simple application to serve API for weather stations Angular module
- __weather-stations-subscriber__ - simple mqtt subscriber, it main usage is to listen some events on mqtt (it is Tasmota weather station event broadcast) and store it in current Weather Station format

## Change Log

### v3.0.0

- feat. create _weather-stations-microservice_ application
- feat. create _weather-stations-subscriber_ application

## Smart Home Server

Described in main README.md file.

## Weather Stations Microservice

## Requirements

* installed _mysql_ server
* installed _netstat_ on server

### Installation

- download repository to your local folder _DIR_
- go to _DIR/server_ and run


    npm i 

- in _apps/weather-stations-microservice_ create file _config.env_ and put content replacing dots to your proper settings


    # Database
    DB_HOST=....
    DB_PORT=....
    DB_USER=....
    DB_PASS=....
    DB_SCHEMA=....
    
- now you can run local version of that server:

    
    npm start:weather-stations-microservice
    
That's all. Your server should start and listen on .

If you need also start UI application please read [App README](../app/README.md).

## Weather Stations Subscriber

### Installation

- download repository to your local folder _DIR_
- go to _DIR/server_ and run


    npm i 

- in _apps/weather-stations-subscriber_ create file _config.env_ and put content replacing dots to your proper settings


    # Database
    DB_HOST=....
    DB_PORT=....
    DB_USER=....
    DB_PASS=....
    DB_SCHEMA=....
    # MQTT
    MQTT_HOST=....
    MQTT_PORT=....
    MQTT_USER=....
    MQTT_PASS=....
    MQTT_TOPIC=....
    
- now you can run local version of that server:

    
    npm start:weather-stations-subscriber
    
That's all. Your server should start and listen on proper topic.

#### Attention

On Tasmota Weather Station configartion you have to set proper topic which will be inline with above topic in configuration. So in my case in Tasmota I have such title: _esp/%topic%/_, where _topic_ is equal _ws_%06X_ and my _MQTT_TOPIC_ configuration value is "esp/+/SENSOR" 

## Connect SonOff device to server

To connect your device to server you will need get:
 
* _API_KEY_ and _ID_ of device
* eWelink app
* access to your home router

Step by step procedure using mobile:
 
* Hold on any button for 5 sec to make WiFi light blinking on your SonOff device
* Now your device is in AP mode, you can now connect to your device 
* connect mobile phone to AP SonOff
* after connection you should be able to send request to your device via Rest Api Client
    
    
    GET: http://10.10.7.1/ap
    headers: Content-Type: application/json

* response should not return error and you have been able to read device _ID_ and _API_KEY_ (write down it, it will be necessary in next step)
* now using original eWelink app connect device via this app. When device is connected please upgrade firmware to 3.3.0+.
* check if device works via eWelink app
* enable _Lan Mode_
* on your router please disable internet connection for your device and assign to it static IP (it is not necessary but simplify your life - I did not do test for dynamic IP)
* check once again if everything works when Internet connection is disabled and only Lan Mode is enabled
* open this application and _Add device_ using previously written _API_KEY_ and _ID_
* generally that's all, after few seconds device should update its information to server (if not please restart server app)
 

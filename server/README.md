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

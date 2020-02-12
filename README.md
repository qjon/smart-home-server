# Smart Home

This is a small project to manage SonOff devices via web

It contains two application
 
 - _app_ - frontend application (UI) (previously called _smart-home_)
 - _server_ - server side application (database, API)(previously called _smart-home-server_) 

## ToDo

* limit number of switches for device (now each device has 4)

## Change log

### v1.5.0

- fix in synchronize data with Weather Stations
- API method /weather-station/:id/sync - manual synchronize

### v1.4.0

- weather stations module, which allows to monitor temperature in humidity from different weather stations devices

### v1.3.1

- upgrade to Angular 8
- fix configuration script

### v1.3.0
- schedule module (add, remove, activate)
- fix layout issues
- add new device module - T1EU1C

### v1.2.0
- display info about room on device details screen
- remove SSL communication (no need SSL certificate)

### v1.1.0
- connect two applications into one project
- add "rooms" functionality (create room, attach/detach device to/from room)
- simplify deploy

### v1.0.1

* small layout fixes for desktop and mobile view
* add new device type CW-001

### v1.0.0
* display list of devices
* allow to add new device
* allow to rename device and switches names on Edit screen
* display information if device is connected or not
* possibility to turn ON/OFF single switch
* possibility to turn ON all switches for device at once
* works with firmware 3.3.0+
* tested on devices T1 EU and S26E

## Requirements

* installed _mysql_ server
* installed _netstat_ on server

## Build app

* clone repository or download it
* install all dependencies

    
    npm i

* init configuration scrip and answer on all questions (below script should create environment files for _app_ and _config.env_ for _server_) 


    npm run config
        
* run


    npm start
   
* in browser go to http://SERVER_IP:API_PORT, the app should start, but to see list of your devices you have to connected them to your local network (see instruction below)

## Deploy

* change _app_ production environment _app/src/environments/environment.prod.ts_
* run

    
    npm deploy    

* change _dist/config.env_ if necessary
* after copy dist folder to target location, go inside that location and run


    npm i --production
    npm start
    
* application will start 


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
 

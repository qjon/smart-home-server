# Smart Home

This is a small project to manage SonOff devices via web

It contains two application
 
 - _app_ - frontend application (UI) (previously called _smart-home_)
 - _server_ - server side application (database, API)(previously called _smart-home-server_) 

## ToDo

* limit number of switches for device (now each device has 4)

## Change log

### v3.0.0

From that point Server and App are separated and Change Log also is split. Please read:

- [App Change Log](app/README.md)
- [Server Change Log](server/README.md)

### v2.0.0

- change communication with Weather Stations (now Weather Station sends data to server, previously server connects to Weather Station API)
- fix problem with timestamp (now all communications, send data from Weather Station or server API used UTC timestamp)
- add new API method to sync data with Weather Station /api/weather-stations/sync
- fix: weather station Week Title range
- fix: go to next/prev in Month Chart

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

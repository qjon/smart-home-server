# WeatherStation

This library provides simple solution to display temperature and humidity for any number of weather stations in your smart home.

# Functionality

- system displays list of weather stations with current temperature and humidity 
- for each weather station system is able to display chart of temperature and humidity change in different period of time (day, 7 days, month, year)
- system allows to move forward and backward in any period of time

# ToDo

- possibility to change weather station name
- possibility to compare two weather station results in period of time

# How to use it

## Installation

    npm i --save @rign/sh-weathe-stations

## Import module

The simplest way to use that library is to create _Wrapper_ module, which will import _WeatherStationsModule_

    @NgModule({
      declarations: [],
      imports: [
        CommonModule,
        WeatherStationsModule,
      ],
    })
    export class WeatherStationsWrapperModule { }
    
## API

To use this module with your ecosystem you need provide data for it.

### API Models

API has two different models to communicate:

    export interface WeatherStationDto {
      id: number;           // id of weather station
      name: string;         // name of weather station
      humidity: number;     // last known humidity (float)
      temperature: number;  // last known temperature (float)
      timestamp: number;    // timestamp of last data read (in miliseconds)
    }

    export interface WeatherStationDataDto {
      id: number;           // id of weather station data record
      timestamp: number;    // timestamp of reading data (in miliseconds)
      humidity: number;     // humidity value (float)
      temperature: number;  // temperature value (float)
    }

### API service interface

You need to implement service based on below interface.

    export interface WeatherStationsApi {
      getList(): Observable<WeatherStationDto[]>;
    
      getAggregateDataForWeek(id: number, year: number, month: number, day: number): Observable<WeatherStationDataDto[]>;
    
      getAggregateDataForDay(id: number, year: number, month: number, day: number): Observable<WeatherStationDataDto[]>;
    
      getAggregateDataForMonth(id: number, year: number, month: number): Observable<WeatherStationDataDto[]>;
    
      getAggregateDataForYear(id: number, year: number): Observable<WeatherStationDataDto[]>;
    }

And provide it in your _AppModule_ 
    
    @NgModule({
      declarations: [],
      imports: [
        CommonModule,
        WeatherStationsModule,
      ],
      providers: [
        {provide: WEATHER_STATIONS_API, useClass: WeatherStationsApiService},
      ],
    })
    export class WeatherStationsWrapperModule { }



## Routing

Finally you have to add your Wrapped module to routing. You can do it in such way:


    const routes: Routes = [
      ... 
      {
        path: 'weather-stations',
        loadChildren: './modules/weather-stations-wrapper/weather-stations-wrapper.module#WeatherStationsWrapperModule'
      },
    ];
    
    @NgModule({
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule]
    })
    export class AppRoutingModule {
    }
    
That's all now you are able to enter weather station module.


# Change Log

## v1.0.0

- list of weather stations with current temperature and humidity 
- each weather station is able to display chart of its temperature and humidity change in different period of time (day, 7 days, month, year)
- move period of time backward and forward

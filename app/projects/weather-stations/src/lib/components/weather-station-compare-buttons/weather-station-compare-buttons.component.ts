import { Component, ChangeDetectionStrategy, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { Destroyable } from '@rign/sh-core';

import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { CompareWeatherStationButton } from '../../interfaces/compare-weather-station-button';
import { WeatherStationsStateConnectorService } from '../../store/state-connectors/weather-stations-state-connector.service';
import { WeatherStationDto } from '../../interfaces/weather-station-dto';
import { ChartType } from '../../interfaces/weather-station-chart-type';

@Component({
  selector: 'sh-weather-station-compare-buttons',
  templateUrl: './weather-station-compare-buttons.component.html',
  styleUrls: ['./weather-station-compare-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherStationCompareButtonsComponent extends Destroyable implements OnInit {
  @Input()
  public isCompare = false;

  @Input()
  public chartType: ChartType;

  @Input()
  public date: Date;

  @Output()
  public toggleCompare: EventEmitter<boolean> = new EventEmitter<boolean>();

  public list$: Observable<CompareWeatherStationButton[]>;

  public isLimit$: Observable<boolean>;

  private weatherStationId: number;

  constructor(private weatherStationsStateConnectorService: WeatherStationsStateConnectorService) {
    super();
  }

  public ngOnInit(): void {
    this.list$ = this.weatherStationsStateConnectorService.compareButtonList$;

    this.isLimit$ = this.list$.pipe(map((items: CompareWeatherStationButton[]) => items.filter(item => item.isAdded).length >= 3));

    this.weatherStationsStateConnectorService.current$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((weatherStation: WeatherStationDto) => this.weatherStationId = weatherStation.id);
  }

  public clickToggleCompare(): void {
    this.toggleCompare.emit(!this.isCompare);
  }

  public addToCompare(id: number) {
    this.weatherStationsStateConnectorService.addWeatherStationToCompare(id, this.chartType, this.date);
  }

  public removeFromCompare(id: number) {
    this.weatherStationsStateConnectorService.removeWeatherStationFromCompare(id);
  }
}

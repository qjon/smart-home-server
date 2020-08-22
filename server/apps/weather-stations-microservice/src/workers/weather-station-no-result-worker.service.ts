import { Inject, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { interval, Subject } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { WorkerInterface } from './worker.interface';
import { WeatherStationEntity, WeatherStationRepositoryService } from '@ri/weather-stations-module';
import { environment } from '../../environment';
import { ObjectEntity, ObjectsEntityRepositoryService } from '@ri/objects';

export interface WeatherStationWithObject {
  ws: WeatherStationEntity,
  object: ObjectEntity,
}

@Injectable()
export class WeatherStationNoResultWorkerService implements WorkerInterface {
  private periodTime = 3_600_000;

  private logger: Logger = new Logger(this.constructor.name);

  @Inject(MailerService)
  private mailerService: MailerService;

  @Inject(WeatherStationRepositoryService)
  private weatherStationRepositoryService: WeatherStationRepositoryService;

  @Inject(ObjectsEntityRepositoryService)
  private objectsEntityRepositoryService: ObjectsEntityRepositoryService;

  private destroy: Subject<void> = new Subject<void>();

  private destroy$ = this.destroy.asObservable();

  public execute(): void {
    interval(3_600_000)
      .pipe(
        startWith(0),
        switchMap(() => fromPromise(this.weatherStationRepositoryService.fetchAllWithLastData())),
        switchMap((weatherStationList: WeatherStationEntity[]) => fromPromise(this.objectsEntityRepositoryService.fetchEntityObjectsByIds(weatherStationList.map(ws => ws.entityId)))
          .pipe(
            map((entities: ObjectEntity[]): WeatherStationWithObject[] => {
              const entitiesMap: Map<number, ObjectEntity> = new Map<number, ObjectEntity>();

              entities.forEach((obj: ObjectEntity) => {
                entitiesMap.set(obj.id, obj);
              });


              return weatherStationList.map(ws => {
                return {
                  ws,
                  object: entitiesMap.get(ws.entityId),
                }
              })
            })
          )
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((weatherStationWithObjectsList: WeatherStationWithObject[]) => {
        weatherStationWithObjectsList.forEach((wsWithObject: WeatherStationWithObject) => {
          this.checkLastResultPeriod(wsWithObject.ws, wsWithObject.object);
        });
      });

  }

  public stop(): void {
    this.destroy.next();
  }

  private checkLastResultPeriod(ws: WeatherStationEntity, obj: ObjectEntity): void {
    const now = Date.now();

    if (!this.isExcludedDevice(obj) && ws.lastData && now - ws.lastData.timestamp * 1000 > this.periodTime) {

      this.logger.warn('No response from WS: ' + ws.name);

      if (this.isSendMailNotificationsEnabled()) {
        this.mailerService
          .sendMail({
            subject: 'No response from WS: ' + ws.name,
            text: this.getTextMessage(ws),
            html: this.getHtmlMessage(ws),
          })
          .then(() => this.logger.log(`Mail send - ${ws.name}`))
          .catch(() => this.logger.error(`Mail not send - ${ws.name}`));
      }
    }
  }

  private getTextMessage(ws: WeatherStationEntity): string {
    let message = '';
    const date: Date = new Date(ws.lastData.timestamp * 1000);

    message += `Since ${date.toLocaleString()} device ${ws.name} does not record data`;

    return message;
  }

  private getHtmlMessage(ws: WeatherStationEntity): string {
    let message = '';
    const date: Date = new Date(ws.lastData.timestamp * 1000);

    message += `Since <b>${date.toLocaleString()}</b> device <b>${ws.name}</b> does not record data`;

    return message;
  }

  private isSendMailNotificationsEnabled(): boolean {
    return environment.notifications.send === 'true';
  }

  private isExcludedDevice(object: ObjectEntity): boolean {
    return Boolean(object) && (environment.notifications.exclude.indexOf(object.ip) > -1 || environment.notifications.exclude.indexOf(object.uniqId) > -1);
  }

}

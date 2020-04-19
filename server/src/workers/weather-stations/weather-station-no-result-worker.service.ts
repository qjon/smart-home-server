import { Inject, Injectable, Logger } from '@nestjs/common';
import { WorkerInterface } from '../worker.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { WeatherStationRepositoryService } from '../../database/repository/weather-station-repository.service';
import { interval, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { WeatherStationEntity } from '../../database/entity/weather-station.entity';
import { environment } from '../../environments';

@Injectable()
export class WeatherStationNoResultWorkerService implements WorkerInterface {
  private periodTime = 60 * 60  * 1000

  private logger: Logger = new Logger(this.constructor.name);

  @Inject(MailerService)
  private mailerService: MailerService;

  @Inject(WeatherStationRepositoryService)
  private weatherStationRepositoryService: WeatherStationRepositoryService;

  private destroy: Subject<void> = new Subject<void>();

  private destroy$ = this.destroy.asObservable();

  public execute(): void {
    interval(3_600_000)
      .pipe(
        startWith(0),
        switchMap(() => fromPromise(this.weatherStationRepositoryService.fetchAllWithLastData())),
        takeUntil(this.destroy$),
      )
      .subscribe((weatherStationList: WeatherStationEntity[]) => {
        weatherStationList.forEach((ws: WeatherStationEntity) => {
          this.checkLastResultPeriod(ws);
        });
      });

  }

  public stop(): void {
    this.destroy.next();
  }

  private checkLastResultPeriod(ws: WeatherStationEntity): void {
    const now = Date.now();
    if (now - ws.lastData.timestamp * 1000 > this.periodTime) {

      this.logger.warn('No response from WS: ' + ws.name);

      if (this.isSendMailNotificationsEnabled()) {
        this.mailerService
          .sendMail({
            to: 'rafal.ignaszewski@gmail.com',
            from: 'raspberry@ignaszewski.pl',
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
    return environment.mail.sendNotifications === 'true';
  }
}

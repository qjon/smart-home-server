import {Injectable} from '@angular/core';
import {NotificationsModule} from './notifications.module';
import {NotificationsService as SimpleNotificationService} from 'angular2-notifications';

@Injectable({
  providedIn: NotificationsModule
})
export class NotificationsService {
  public constructor(private simpleNotificationService: SimpleNotificationService) {

  }

  public success(title: string, message: string): void {
    this.simpleNotificationService.success(title, message);
  }

  public error(title: string, message: string): void {
    this.simpleNotificationService.error(title, message);
  }
}

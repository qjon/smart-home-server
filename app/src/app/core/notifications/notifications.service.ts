import {Injectable} from '@angular/core';

import {NotificationsService as SimpleNotificationService} from 'angular2-notifications';

import {NotificationsModule} from './notifications.module';

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

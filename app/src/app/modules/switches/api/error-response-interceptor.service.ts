import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {NotificationsService} from '@core/notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorResponseInterceptorService implements HttpInterceptor {

  constructor(private notificationsService: NotificationsService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req)
      .pipe(
        catchError((event) => {
          if (event instanceof HttpErrorResponse && event.status >= 400) {
            this.notificationsService.error(`Error ${event.status}`, event.error.message);
          }

          return throwError(event);
        })
      );
  }
}

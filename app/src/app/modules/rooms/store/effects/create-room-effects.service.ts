import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CreateRoomAction, CreateRoomErrorAction, CreateRoomSuccessAction, RoomsActionTypes} from '../rooms-actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {AddRoomComponent} from '../../components/add-room/add-room.component';
import {RoomsApiService} from '../../api/rooms-api.service';
import {of} from 'rxjs';
import {RoomWithDevicesDto} from '../../interfaces/room-dto.interface';
import {NotificationsService} from '../../../notifications/notifications.service';

@Injectable()
export class CreateRoomEffectsService {

  @Effect({dispatch: false})
  public openCreateRoomEffect$ = this.actions$
    .pipe(
      ofType(RoomsActionTypes.OpenCreateDialog),
      switchMap(() => {
        this.addDialogRef = this.matDialog.open<AddRoomComponent>(AddRoomComponent, {
          width: '400px',
          panelClass: 'add-room',
          disableClose: true,
        });

        return this.addDialogRef.afterClosed();
      })
    );


  @Effect({dispatch: true})
  public createRoomEffect$ = this.actions$
    .pipe(
      ofType(RoomsActionTypes.Create),
      switchMap((action: CreateRoomAction) => this.roomsApi.create(action.payload.name)
        .pipe(
          map((room: RoomWithDevicesDto) => new CreateRoomSuccessAction({room})),
          catchError((error) => of(new CreateRoomErrorAction({error})))
        )
      )
    );

  @Effect({dispatch: false})
  public createRoomErrorEffect$ = this.actions$
    .pipe(
      ofType(RoomsActionTypes.CreateError),
      tap((action: CreateRoomErrorAction) => {
        this.notificationService.error('Add room', 'New room has not been created');
      })
    );

  @Effect({dispatch: false})
  public createRoomSuccessEffect$ = this.actions$
    .pipe(
      ofType(RoomsActionTypes.CreateSuccess),
      tap((action: CreateRoomSuccessAction) => {
        this.addDialogRef.close();
        this.notificationService.success('Add room', 'New room has been created');
      })
    );

  private addDialogRef: MatDialogRef<AddRoomComponent>;

  constructor(private actions$: Actions,
              private matDialog: MatDialog,
              private roomsApi: RoomsApiService,
              private notificationService: NotificationsService) {
  }
}

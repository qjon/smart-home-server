import {Inject, Injectable} from '@angular/core';
import {RoomsGuardsModule} from '../rooms-guards.module';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {RoomsApiService} from '../../api/rooms-api.service';
import {RoomsStateConnectorService} from '../../store/state-connectors/rooms-state-connector.service';
import {RoomsStateConnectorInterface} from '../../interfaces/rooms-state-connector.interface';
import {tap} from 'rxjs/operators';
import {RoomWithDevicesDto} from '../../interfaces/room-dto.interface';

@Injectable({
  providedIn: RoomsGuardsModule
})
export class RoomsListResolverService implements Resolve<RoomWithDevicesDto[]> {

  constructor(private roomsApi: RoomsApiService,
              @Inject(RoomsStateConnectorService) private roomsStateConnector: RoomsStateConnectorInterface) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RoomWithDevicesDto[]> {
    return this.roomsApi.list()
      .pipe(
        tap((rooms: RoomWithDevicesDto[]) => this.roomsStateConnector.loadRooms(rooms))
      );
  }
}

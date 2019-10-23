import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ROOMS_STATE_NAME, RoomsState} from './rooms-reducer';
import {RoomWithDevicesDto} from '../interfaces/room-dto.interface';

const roomsFeatureSelector = createFeatureSelector<RoomsState>(ROOMS_STATE_NAME);
const list = createSelector(roomsFeatureSelector, (s: RoomsState): RoomWithDevicesDto[] => s.ids.map((roomId) => s.rooms[roomId])
  .sort((a: RoomWithDevicesDto, b: RoomWithDevicesDto) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1));

const currentSelected = createSelector(roomsFeatureSelector, (s: RoomsState): RoomWithDevicesDto => s.rooms[s.currentSelectedId]);
const getRoom = createSelector(roomsFeatureSelector, (s: RoomsState, params: { id: number }): RoomWithDevicesDto => s.rooms[params.id]);

export const RoomsSelectors = {
  currentSelected,
  getRoom,
  list,
};

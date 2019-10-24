import {createFeatureSelector, createSelector} from '@ngrx/store';
import {SWITCHES_STATE_NAME, SwitchesState} from './switches-reducer';
import {SwitchDeviceModel} from '../models/switch-device-model';
import {RoomsSelectors} from '../../rooms/store/rooms-selectors';
import {RoomWithDevicesDto} from '../../rooms/interfaces/room-dto.interface';

const switchesFeatureSelector = createFeatureSelector<SwitchesState>(SWITCHES_STATE_NAME);
const switchesDeviceListSelector = createSelector(switchesFeatureSelector, RoomsSelectors.currentSelected, (s: SwitchesState, room: RoomWithDevicesDto): SwitchDeviceModel[] => {
  const ids = room ? room.devices : s.ids;

  return ids.map(id => new SwitchDeviceModel(s.devices[id]));
});
const deviceSelector = createSelector(
  switchesFeatureSelector,
  (s: SwitchesState, params: { deviceId: string }): SwitchDeviceModel => s.devices[params.deviceId] ? new SwitchDeviceModel(s.devices[params.deviceId]) : null
);
const allIds = createSelector(switchesFeatureSelector, (s: SwitchesState): string[] => s.ids);

export const switchesSelectors = {
  allIds,
  deviceSelector,
  switchesFeatureSelector,
  switchesDeviceListSelector,
};

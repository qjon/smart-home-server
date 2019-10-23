import {SwitchDeviceDto, SwitchNameDto, SwitchStatus} from '../interfaces/switch-device.interface';
import {SwitchActionTypes, SwitchesAction} from './switches-actions';

export interface SwitchesState {
  devices: { [key: string]: SwitchDeviceDto };
  ids: string[];
}

export const emptySwitchesState: SwitchesState = {
  devices: {},
  ids: [],
};

export const SWITCHES_STATE_NAME = 'switches';

export function switchesReducer(state: SwitchesState = emptySwitchesState, action: SwitchesAction): SwitchesState {
  switch (action.type) {
    case SwitchActionTypes.ChangeConnectionStatus:
      return {
        ...state,
        devices: {
          ...state.devices,
          [action.payload['deviceId']]: {
            ...state.devices[action.payload['deviceId']],
            isConnected: action.payload['isConnected'],
          }
        }
      };
    case SwitchActionTypes.Load:
      const newState: SwitchesState = {...emptySwitchesState};

      action.payload['devices'].forEach((d) => {
        const id = d.deviceid;

        newState.devices[id] = d;
        newState.ids.push(id);
      });

      return newState;
    case SwitchActionTypes.OnOffSuccess:
      const status = action.payload['status'] === SwitchStatus.ON ? SwitchStatus.ON : SwitchStatus.OFF;
      return {
        ...state,
        devices: {
          ...state.devices,
          [action.payload['deviceId']]: {
            ...state.devices[action.payload['deviceId']],
            params: {
              ...state.devices[action.payload['deviceId']].params,
              switches: state.devices[action.payload['deviceId']].params.switches.map((s: SwitchNameDto) => {
                return {
                  ...s,
                  switch: status
                };
              })
            }
          }
        }
      };
    case SwitchActionTypes.ChangeStatusSuccess:
      const deviceId = action.payload['deviceId'];
      return {
        ...state,
        devices: {
          ...state.devices,
          [deviceId]: {
            ...state.devices[deviceId],
            params: {
              ...state.devices[deviceId].params,
              switches: state.devices[deviceId].params.switches.map((s: SwitchNameDto) => {
                if (s.outlet === action.payload['switch'].outlet) {
                  return {...s, ...action.payload.switch};
                } else {
                  return s;
                }
              })
            }
          }
        }
      };
    case SwitchActionTypes.Update:
      return {
        ...state,
        devices: {
          ...state.devices,
          [action.payload['deviceId']]: {
            ...state.devices[action.payload['deviceId']],
            params: {
              ...state.devices[action.payload['deviceId']].params,
              switches: action.payload['params']
            }
          }
        }
      };
    case SwitchActionTypes.ChangeSettingsSuccess:
      const data = action.payload.data;

      return {
        ...state,
        devices: {
          ...state.devices,
          [action.payload.deviceId]: {
            ...state.devices[action.payload.deviceId],
            name: data.name,
            model: data.model,
            apiKey: data.apiKey,
            params: {
              ...state.devices[action.payload.deviceId].params,
              switches: state.devices[action.payload.deviceId].params.switches.map((s: SwitchNameDto) => {
                const nameObj = data.switches.find((i) => i.outlet === s.outlet);

                return {
                  ...s,
                  name: nameObj.name,
                };
              })
            }
          }
        }
      };
    case SwitchActionTypes.SetRoom:
      return {
        ...state,
        devices: {
          ...state.devices,
          [action.payload.deviceId]: {
            ...state.devices[action.payload.deviceId],
            room: action.payload.room
          }
        }
      };
    default:
      return {...state};
  }
}

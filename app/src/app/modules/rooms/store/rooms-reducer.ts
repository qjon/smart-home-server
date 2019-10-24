import {RoomWithDevicesDto} from '../interfaces/room-dto.interface';
import {RoomsAction, RoomsActionTypes} from './rooms-actions';

export interface RoomsState {
  rooms: { [key: string]: RoomWithDevicesDto };
  ids: number[];
  currentSelectedId: number;
}

export const emptyRoomsState: RoomsState = {
  rooms: {},
  ids: [],
  currentSelectedId: null,
};

export const ROOMS_STATE_NAME = 'rooms';

export function roomsReducer(state: RoomsState = emptyRoomsState, action: RoomsAction): RoomsState {
  let roomId: number;

  switch (action.type) {
    case RoomsActionTypes.Load:
      const rooms: { [key: string]: RoomWithDevicesDto } = {};
      const ids: number[] = [];

      action.payload.rooms.forEach((room) => {
        const id = room.id;

        rooms[id] = room;
        ids.push(room.id);
      });

      return {
        ...state,
        rooms,
        ids,
      };
    case RoomsActionTypes.CreateSuccess:
      const room = action.payload.room;
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [room.id]: room,
        },
        ids: [...state.ids, room.id],
      };
    case RoomsActionTypes.SelectRoom:
      return {
        ...state,
        currentSelectedId: action.payload.roomId,
      };
    case RoomsActionTypes.AttachSuccess:
      roomId = action.payload.roomId;
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [roomId]: {
            ...state.rooms[roomId],
            devices: [...state.rooms[roomId].devices, action.payload.deviceId],
          }
        }
      };
    case RoomsActionTypes.DetachSuccess:
      roomId = action.payload.roomId;
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [roomId]: {
            ...state.rooms[roomId],
            devices: state.rooms[roomId].devices.filter((deviceId) => deviceId !== action.payload.deviceId),
          }
        }
      };
    default:
      return {...state};
  }
}

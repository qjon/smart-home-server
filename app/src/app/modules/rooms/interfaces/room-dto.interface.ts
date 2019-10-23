export interface RoomDto {
  id: number;
  name: string;
}

export interface RoomWithDevicesDto extends RoomDto {
  devices: string[];
}

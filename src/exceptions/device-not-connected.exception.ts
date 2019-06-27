import { HttpException, HttpStatus } from '@nestjs/common';

export class DeviceNotConnectedException extends HttpException {
  constructor(id: string) {
    super(`Device ${id} not connected`, HttpStatus.BAD_REQUEST);
  }
}

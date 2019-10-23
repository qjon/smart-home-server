import { HttpException, HttpStatus } from '@nestjs/common';

export class DeviceIdException extends HttpException {
  constructor() {
    super('No device id', HttpStatus.BAD_REQUEST);
  }
}

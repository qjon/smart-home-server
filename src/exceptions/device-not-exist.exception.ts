import { HttpException, HttpStatus } from '@nestjs/common';

export class DeviceNotExistException extends HttpException {
  constructor(id: string) {
    super(`Device does not exist (id: ${id})`, HttpStatus.BAD_REQUEST);
  }
}

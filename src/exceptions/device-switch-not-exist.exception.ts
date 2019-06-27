import { HttpException, HttpStatus } from '@nestjs/common';

export class DeviceSwitchNotExistException extends HttpException {
  constructor(id: string, outlet: number) {
    super(`Device switch does not exist (id: ${id}, outlet: ${outlet})`, HttpStatus.BAD_REQUEST);
  }
}

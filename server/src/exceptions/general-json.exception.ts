import { HttpException, HttpStatus } from '@nestjs/common';

export class GeneralJsonException extends HttpException {
  constructor() {
    super('Unexpected error', HttpStatus.BAD_REQUEST);
  }
}

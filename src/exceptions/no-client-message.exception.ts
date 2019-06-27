import { HttpException, HttpStatus } from '@nestjs/common';

export class NoClientMessageException extends HttpException {
  constructor(id: string) {
    super(`No message id: ${id}`, HttpStatus.BAD_REQUEST);
  }
}

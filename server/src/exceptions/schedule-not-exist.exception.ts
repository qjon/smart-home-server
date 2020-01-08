import { HttpException, HttpStatus } from '@nestjs/common';

export class ScheduleNotExistException extends HttpException {
  constructor(id: string) {
    super(`Schedule does not exist (id: ${id})`, HttpStatus.BAD_REQUEST);
  }
}

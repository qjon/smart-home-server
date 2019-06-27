import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get('/')
  root(): string {
    return 'OK';
  }

  @Get('/test')
    test(): string {
    return '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '    <meta charset="UTF-8">\n' +
      '    <title>Title</title>\n' +
      '    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"></script>\n' +
      '    <script>\n' +
      '      var socket = io(\'ws://localhost:8443\');\n' +
      '    </script>\n' +
      '</head>\n' +
      '<body>\n' +
      '\n' +
      '</body>\n' +
      '</html>\n';
  }
}

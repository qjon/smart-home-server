import { ResponseInterface } from '../../interfaces/response-interface';

export class WebsocketDeviceErrorResponse implements ResponseInterface {
  public error = 1;

  constructor(public message: string, public apikey: string, public deviceid: string) {

  }
}

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HomeAssistantSubscriberService {
  private logger = new Logger(this.constructor.name);

  public convertTopicToDeviceSymbol(topic: string): string {
    const topicArray: string[] = topic.split('/');

    return topicArray[1].replace('ws_', '');
  }
}

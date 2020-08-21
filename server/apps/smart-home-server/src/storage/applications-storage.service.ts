import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'nodejs-websocket';

export interface AppConnection {
  id: string;
  conn: Connection;
}

@Injectable()
export class ApplicationsStorageService {

  protected logger = new Logger(ApplicationsStorageService.name);

  protected storage: {
    apps: Map<string, AppConnection>;
    ids: string[];
  };

  public constructor() {
    this.storage = {
      apps: new Map<string, AppConnection>(),
      ids: [],
    };
  }

  public add(conn: Connection): string {
    const id = conn.key;

    this.storage.apps.set(id, { id, conn });
    this.storage.ids.push(id);

    return id;
  }

  public getConnection(id: string): AppConnection {
    return this.storage.apps.get(id);
  }

  public remove(id): boolean {
    this.storage.apps.delete(id);
    this.storage.ids = this.storage.ids.filter(i => i !== id);

    return true;
  }

  public getAll(): AppConnection[] {
    return this.storage.ids.map((id) => this.storage.apps.get(id));
  }

  public sendMessageToAll(message: string): void {
    const all = this.getAll();

    all.map((appClient: AppConnection) => {
      this.logger.verbose('Send message to ' + appClient.conn.key + ' message: ' + message);

      appClient.conn.sendText(message);
    });
  }
}

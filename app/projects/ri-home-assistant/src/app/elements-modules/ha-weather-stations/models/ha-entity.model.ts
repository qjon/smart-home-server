import { DateTimeMillisecondsZone } from '../../../models/date-time-zone';

export interface HaEntityModel {
  attributes: any;
  context: {
    id: string;
    parent_id: string;
    user_id: string;
  };
  entity_id: string;
  last_changed: DateTimeMillisecondsZone;
  last_updated: DateTimeMillisecondsZone;
  state: string;
}

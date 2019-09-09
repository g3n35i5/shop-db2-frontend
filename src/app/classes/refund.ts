import { User } from '../interfaces/user';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Transform, Type } from 'class-transformer';

export class Refund {
  id: number;
  admin_id: number;
  total_price: number;
  @Type(() => Date)
  @Transform(value => moment(value), { toClassOnly: true })
  timestamp: Moment;
  comment: string;
  admin?: User;
  revoked: boolean;
}

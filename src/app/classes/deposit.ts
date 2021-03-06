import {User} from '../classes/user';
import * as moment from 'moment-timezone/builds/moment-timezone.min.js';
import {Moment} from 'moment-timezone';
import {Transform, Type} from 'class-transformer';

export class Deposit {
  id: number;
  admin_id: number;
  amount: number;
  @Type(() => Date)
  @Transform(value => moment(value), {toClassOnly: true})
  timestamp: Moment;
  comment: string;
  admin?: User;
  revoked: boolean;
}

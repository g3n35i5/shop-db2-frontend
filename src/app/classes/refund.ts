import {User} from '../classes/user';
import * as moment from 'moment';
import {Moment} from 'moment';
import {Transform, Type} from 'class-transformer';

export class Refund {
  id: number;
  admin_id: number;
  total_price: number;
  @Type(() => Date)
  @Transform(value => moment(value), {toClassOnly: true})
  timestamp: Moment;
  comment: string;
  admin?: User;
  revoked: boolean;
}

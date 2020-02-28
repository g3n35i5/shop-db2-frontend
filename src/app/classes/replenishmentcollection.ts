import {User} from '../classes/user';
import * as moment from 'moment-timezone/builds/moment-timezone.min.js';
import {Moment} from 'moment-timezone';
import {Transform, Type} from 'class-transformer';

export class Replenishmentcollection {
  id: number;
  admin_id: number;
  seller_id: number;
  price: number;
  @Type(() => Date)
  @Transform(value => moment(value), {toClassOnly: true})
  timestamp: Moment;
  comment: string;
  admin?: User;
  seller?: User;
  revoked: boolean;
}

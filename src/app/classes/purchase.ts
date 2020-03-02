import {Product} from '../classes/product';
import {User} from '../classes/user';
import * as moment from 'moment-timezone/builds/moment-timezone.min.js';
import {Moment} from 'moment-timezone';
import {Transform, Type} from 'class-transformer';

export class Purchase {
  id: number;
  product_id: number;
  product?: Product;
  user_id: number;
  admin_id?: number;
  user?: User;
  admin?: User;
  @Type(() => Date)
  @Transform(value => moment(value), {toClassOnly: true})
  timestamp: Moment;
  amount: number;
  price: number;
  revoked: boolean;
}

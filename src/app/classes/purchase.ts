import { Product } from '../interfaces/product';
import { User } from '../classes/user';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Transform, Type } from 'class-transformer';

export class Purchase {
  id: number;
  product_id: number;
  product?: Product;
  user_id: number;
  user?: User;
  @Type(() => Date)
  @Transform(value => moment(value), { toClassOnly: true })
  timestamp: Moment;
  amount: number;
  price: number;
  revoked: boolean;
}

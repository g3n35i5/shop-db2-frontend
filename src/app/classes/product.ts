import * as moment from 'moment-timezone/builds/moment-timezone.min.js';
import {Moment} from 'moment-timezone';
import {Transform, Type} from 'class-transformer';

export class Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
  active?: boolean;
  countable?: boolean;
  revocable?: boolean;
  imagename: string;
  tags: number[];
  @Type(() => Date)
  @Transform(value => moment(value), {toClassOnly: true})
  creation_date: Moment;
}

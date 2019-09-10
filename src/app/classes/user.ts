import {Transform, Type} from 'class-transformer';
import * as moment from 'moment';
import {Moment} from 'moment';

export class User {
  id: number;
  firstname: string;
  lastname: string;
  credit: number;
  rank_id: number;
  is_admin: boolean;
  @Type(() => Date)
  @Transform(value => moment(value), { toClassOnly: true })
  creation_date: Moment;

  @Type(() => Date)
  @Transform(value => moment(value), { toClassOnly: true })
  verification_date: Moment;

  getUsername(lastnameFirst = false): string {
    if (lastnameFirst && this.firstname) {
      return [this.lastname, this.firstname].join(', ');
    } else if (lastnameFirst) {
      return this.lastname;
    }
    return[this.firstname, this.lastname].join(' ');
  }
}

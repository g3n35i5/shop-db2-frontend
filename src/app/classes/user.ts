import {Transform, Type} from 'class-transformer';
import * as moment from 'moment-timezone/builds/moment-timezone.min.js';
import {Moment} from 'moment-timezone';
import {environment} from '../../environments/environment';

export class User {
  id: number;
  firstname: string;
  lastname: string;
  credit: number;
  rank_id: number;
  is_admin: boolean;
  imagename: string;
  @Type(() => Date)
  @Transform(value => moment(value), {toClassOnly: true})
  creation_date: Moment;

  @Type(() => Date)
  @Transform(value => moment(value), {toClassOnly: true})
  verification_date: Moment;

  getUsername(lastnameFirst = false): string {
    if (lastnameFirst && this.firstname) {
      return [this.lastname, this.firstname].join(', ');
    } else if (lastnameFirst) {
      return this.lastname;
    }
    return [this.firstname, this.lastname].join(' ');
  }

  getImageURL(): string|undefined {
    const path = environment.apiURL + 'images/';
    return this.imagename !== null ? path + this.imagename : null;
  }
}

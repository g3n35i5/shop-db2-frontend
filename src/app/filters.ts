import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({name: 'customCurrency'})
export class CustomCurrency implements PipeTransform {
  transform(input: number): number {
    if (typeof (input) === 'undefined' || input === null) {
      return null;
    }
    return input / 100;
  }
}

@Pipe({name: 'customTimestamp'})
export class CustomTimestamp implements PipeTransform {
  transform(input: string, format = 'ddd, DD MMM YYYY HH:mm'): string {
    if (typeof (input) === 'undefined' || input === null) {
      return 'unknown';
    }
    const date = moment(new Date(input));
    return date.tz('Europe/Berlin').format(format);
  }
}

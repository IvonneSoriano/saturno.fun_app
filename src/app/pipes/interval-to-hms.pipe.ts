import { Pipe, PipeTransform, Injectable } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'intervalToHms'
})
@Injectable({
	providedIn: 'root'
})
export class IntervalToHmsPipe implements PipeTransform {

  transform(timeFrom: number, timeTo?: number): string {
    if(!timeTo) timeTo = + new Date();
    if(!timeFrom) return '-';
    let interval = timeTo - timeFrom;
    console.log('timeTo', timeTo, 'timeFrom', timeFrom)

    console.log('interval', interval)
    let duration = moment.duration(interval);
    let h = duration.hours();
    let m = duration.minutes();
    let s = duration.seconds();
    let hh: string = h <= 9 ? '0' + h.toString() : h.toString(); 
    let mm: string = m <= 9 ? '0' + m.toString() : m.toString(); 
    let ss: string = s <= 9 ? '0' + s.toString() : s.toString(); 
    return `${hh}:${mm}:${ss}`;
  }

}

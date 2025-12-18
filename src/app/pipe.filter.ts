import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], searchId: string): any[] {
    if (!searchId) {
      return value;
    }
    return value.filter(data => data.id.toString().includes(searchId));
  }
}
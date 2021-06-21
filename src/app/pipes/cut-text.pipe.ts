import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutText'
})
export class CutTextPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string{
    return value.length > 40 ? (value.slice(0,40)+"...") : value;
  }

}

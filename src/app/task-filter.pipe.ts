import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'matchesTask'
})
export class MathcesTaskPipe implements PipeTransform {
    transform(items: Array<any>, tid): Array<any> {
        return items.filter(item => item.id !== tid);
    }
}
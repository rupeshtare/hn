import { Pipe, PipeTransform } from '@angular/core';

/*
 * Return the value for given key chain
 * e.g. data = {'menu': {'name': 'tea'}}
 *      'menu.title' => 'tea'
 *      'menu.price' => undefined
*/

@Pipe({
    name: 'chainedattribute',
    pure: false
})

export class ChainedAttributePipe implements PipeTransform {
    transform(path: string, data: object): any {
        return path.split('|')[0].split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : data[path];
        }, data || self);
    }
}

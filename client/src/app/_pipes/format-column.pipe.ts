import { Pipe, PipeTransform } from '@angular/core';

/*
 * Splits the given text by Upper Case Character
 * and changes the first letter of every word into Upeercase
 * e.g. 'splitAndTitle' => 'Split And Title'
*/

@Pipe({
    name: 'formatcolumn',
    pure: false
})

export class FormatColumnPipe implements PipeTransform {
    transform(input: any): string {
        let output = '-';
        switch (Object.prototype.toString.call(input)) {
            case '[object Array]': {
                output = input.join(', ');
                break;
            }
            case '[object Object]': {
                output = Object.keys(input).filter(key => input[key]).join(', ');
                break;
            }
            case '[object String]': {
                output = input;
                break;
            }
            case '[object Number]': {
                output = input.toString();
                break;
            }
            case '[object Boolean]': {
                output = input ? 'Yes' : 'No';
                break;
            }
            default: {
                break;
            }
        }

        return output;
    }
}

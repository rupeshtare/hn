import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

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
    transform(input: any, path: string): any {
        let output: any = '-';
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

        // check for format
        const arr = path.split('|');
        if (arr && arr.length > 1 && output !== '-') {
            switch (arr[1]) {
                case 'date': {
                    output = moment(output).format('DD/MM/YYYY');
                    break;
                }
                case 'ago': {
                    output = moment.duration(moment().diff(moment(output))).humanize() + ' ago';
                    break;
                }
                default: {
                    break;
                }
            }
        }

        return output;
    }
}

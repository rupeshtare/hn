import { Pipe, PipeTransform } from '@angular/core';

/*
 * Splits the given text by Upper Case Character
 * and changes the first letter of every word into Upeercase
 * e.g. 'splitAndTitle' => 'Split And Title'
*/

@Pipe({
    name: 'splitandtitle',
    pure: false
})

export class SplitAndTitlePipe implements PipeTransform {
    transform(input: string): string {
        return input.length > 0 ? input.split('|')[0].split(/(?=[.])/)[input.split(/(?=[.])/).length - 1]
            .split(/(?=[A-Z .])/)
            .map(txt => {
                if (txt[0] === '.') {
                    return txt[1].toUpperCase() + txt.substr(2);
                }
                return txt[0].toUpperCase() + txt.substr(1);
            })
            .join(' ') : '';
    }
}

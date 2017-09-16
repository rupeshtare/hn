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
    transform(input:string): string{
        return input.length > 0 ? input.split(/(?=[A-Z])/).map(txt => txt[0].toUpperCase() + txt.substr(1)).join(" ") : "";
    }
}
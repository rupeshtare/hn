import { Component, Input } from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'hn-page-header',
    templateUrl: './page-header.component.html',
})


export class PageHeaderComponent {
    @Input() header = '';
    @Input() addNew = false;
    @Input() addNewLink = 'new';
    @Input() icon = '';
}

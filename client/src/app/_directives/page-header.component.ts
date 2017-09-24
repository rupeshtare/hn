import { Component, Input } from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'hnPageHeader',
    templateUrl: './page-header.component.html',
})


export class PageHeaderComponent {
    @Input() header : string = '';
    @Input() addNew : boolean = false;
    @Input() addNewLink : string = 'new';
    @Input() icon : string = '';
}
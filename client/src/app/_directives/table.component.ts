import { Component, Input, ViewChild } from '@angular/core';
import { LocalStorageService } from '../_services/index';

@Component({
    moduleId: module.id,
    selector: 'hnTable',
    templateUrl: 'table.component.html'
})
 
export class TableComponent {
    @Input() tableClass : string = 'table table-hover';
    @Input() tableHeaderClass : string = 'thead-inverse';
    @Input() indexColumn : boolean = true;
    @Input() selectableColumn : string = '_id';
    @Input() defaultColumns : Array<string> = [];
    @Input() tableColumns : Array<string> = [];
    @Input() tableData : Array<object> = [];
    @Input() name : string;

    private selectedColoumns : Array<string>;

    constructor(private localStorageService : LocalStorageService) { }

    ngOnInit(){
        this.getTableColoumns();
    }

    getTableColoumns() : void {
        let columns = this.localStorageService.get(this.name);
        if(columns)
            this.selectedColoumns = columns;
        else
            this.selectedColoumns = this.defaultColumns;
    }

    setTableColoumns(columns: any) : void {
        this.selectedColoumns = Object.keys(columns).filter(key=>{return columns[key];});
        this.selectedColoumns = [...this.defaultColumns, ...this.selectedColoumns];
        this.localStorageService.set(this.name, this.selectedColoumns);
    }
}
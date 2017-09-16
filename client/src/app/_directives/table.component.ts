import { Component, Input, ViewChild } from '@angular/core';

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
    @Input() tableColumns : Array<string> = [];
    @Input() tableData : Array<object> = [];

    private selectedColoumns : Array<string>;

    ngOnInit(){
        this.selectedColoumns = this.tableColumns;
    }

    public changeColoumns(columns: any) : void {
        this.selectedColoumns = Object.keys(columns).filter(key=>{
            return columns[key];
        })
    }
}
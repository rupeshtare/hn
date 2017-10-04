import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
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
    @Input() total : number = 0;
    @Input() pageBy : number = 10;
    @Input() grid : boolean = false;
    @Input() selectable : boolean = true;
    @Input() print: boolean = false;

    @Output() loadData : EventEmitter<any> = new EventEmitter<any>();
    @Output() callBackFunction : EventEmitter<any> = new EventEmitter<any>();

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
        this.selectedColoumns = this.tableColumns.filter(col=>{
            if(this.selectedColoumns.includes(col))
                return col;
        });
        this.localStorageService.set(this.name, this.selectedColoumns);
    }

    loadTableData(pageObject: object) : void {
        this.loadData.emit(pageObject)
    }

    toggleView(val: boolean) : void {
        this.grid = val;
    }

    selectCallBack(data: object) : void {
        this.callBackFunction.emit(data);
    }
}
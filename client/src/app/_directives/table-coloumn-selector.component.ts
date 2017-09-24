import { Component, Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
 
@Component({
    moduleId: module.id,
    selector: 'hnTableColumnSelector',
    templateUrl: 'table-coloumn-selector.component.html'
})
 
export class TableColumnSelectorComponent implements OnInit {
    @Input() tableColumns : Array<string> = [];
    @Input() defaultColumns : Array<string> = [];
    @Input() selectedColoumns : Array<string> = [];
    @Output() selectColumns : EventEmitter<any> = new EventEmitter<any>();

    columnForm : FormGroup;
    selectableColumns : Array<string> = [];

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.selectableColumns = this.tableColumns.filter(column=>{
            if(!this.defaultColumns.includes(column))
                return column;
        })

        this.columnForm = this.formBuilder.group(
            this.selectableColumns.reduce((prev, curr)=>{
                if(this.selectedColoumns.includes(curr))
                    prev[curr]=true;
                else
                    prev[curr]=false;
                return prev;
            },{})
        )

        this.columnForm.valueChanges.subscribe(data=>{
            this.selectColumns.emit(data);
        })
    }

    reset() : void {
        this.columnForm.reset({});
    }
}
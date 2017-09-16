import { Component, Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
 
@Component({
    moduleId: module.id,
    selector: 'hnTableColumnSelector',
    templateUrl: 'table-coloumn-selector.component.html'
})
 
export class TableColumnSelectorComponent implements OnInit {
    @Input() tableColumns : Array<string> = [];
    @Output() selectColumns : EventEmitter<any> = new EventEmitter<any>();
    columnForm : FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {        
        this.columnForm = this.formBuilder.group(
            this.tableColumns.reduce((prev, curr)=>{prev[curr] = true; return prev;},{})
        )

        this.columnForm.valueChanges.subscribe(data=>{
            this.selectColumns.emit(data);
        })
    }
}
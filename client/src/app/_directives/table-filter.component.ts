import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TableService } from '../_services/table.service';
import * as _ from 'lodash';


@Component({
    moduleId: module.id,
    selector: 'hn-table-filter',
    templateUrl: './table-filter.component.html',
})


export class TableFilterComponent implements OnInit {
    @Input() tableColumns: Array<string> = [];

    @Output() applyFilters: EventEmitter<any> = new EventEmitter<any>();

    public objectKeys = Object.keys;
    public applyFilter: boolean = false;
    public filterForm: FormGroup;
    public operations = {
        'CONTAINS': '$regex',
        'EQUAL TO': '$eq', 'NOT EQUAL TO': '$ne', 'LESS THAN': '$lt',
        'LESS THAN OR EQUAL TO': '$lte', 'GREATER THAN': '$gt',
        'GREATER THAN OR EQUAL TO': '$gte', 'IN': '$in', 'NOT IN': '$nin',
    };

    constructor(private formBuilder: FormBuilder,
        private tableService: TableService) { }

    ngOnInit() {

        this.filterForm = this.formBuilder.group({
            filters: this.formBuilder.array([this.initFilter()])
        });
    }

    toggleFilter() {
        this.applyFilter = !this.applyFilter;
        if (this.applyFilter === false) {
            this.submit({});
        }
    }

    initFilter(): FormGroup {
        return this.formBuilder.group({
            tableColumn: null,
            filterValue: null,
            operation: null
        });
    }

    addFilter(i: number) {
        // const control = <FormArray>this.filterForm.get('filters');
        // if (control.controls[control.length - 1].value.filterValue !== null) {
        //     control.push(this.initFilter());
        // }
    }

    removeFilter(i: number) {
        const control = <FormArray>this.filterForm.get('filters');
        control.removeAt(i);
    }

    submit(data) {
        data.filters = _.filter(data.filters,
            d => {
                return d['tableColumn'] !== null && d['operation'] !== null && d['filterValue'] !== null
            }
        )
        this.tableService.notifyFilterOther(JSON.stringify(data.filters));
    }
}

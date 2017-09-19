import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'hnPagination',
    templateUrl: './table-pagination.component.html',
})


export class TablePaginationComponent implements OnInit {
    @Input() total : number = 0;
    @Input() pageBy : number = 10;

    @Output() loadData : EventEmitter<any> = new EventEmitter<any>();

    start : number = 1;
    end : number = 0;

    ngOnInit(){
        this.loadTableData();
        this.end = this.pageBy;
    }
    
    loadTableData() {
        let data = {skip: this.start-1, limit: this.pageBy};
        this.loadData.emit(data);
    }

    loadNextData() {
        this.start = this.end + 1 <= this.total ? this.end + 1 : this.start;
        this.end = this.end + this.pageBy <= this.total ? this.end + this.pageBy : this.total;
        this.loadTableData();
    }

    loadPreviousData() {
        this.end = this.start - 1 >= 1 ? this.start - 1 : this.end;
        this.start = this.start - this.pageBy >= 1 ? this.start - this.pageBy : this.start;
        this.loadTableData();
    }
}
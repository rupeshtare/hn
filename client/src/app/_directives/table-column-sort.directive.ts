import { Directive, HostListener, Renderer, ElementRef, Input } from '@angular/core';
import { TableService } from '../_services/table.service';


@Directive({
    selector: '[hnTableColumnSort]'
})

export class TableColumnSortDirective {
    @Input() hnTableColumnSort: string;

    private sortColumn = null;
    private sortOrder = true;

    constructor(
        private _renderer: Renderer,
        private _elem: ElementRef,
        private tableService: TableService) { }

    @HostListener('click') click() {
        this.sort(this.hnTableColumnSort);
    }

    sort(column) {
        if (this.tableService.prevElem !== null) {
            this._renderer.setElementProperty(
                this.tableService.prevElem.nativeElement,
                'innerHTML',
                this.tableService.prevElem.nativeElement.innerText);
        }
        this.tableService.prevElem = this._elem;

        if (this.tableService.sortColumn === column) {
            this.tableService.sortOrder = !this.tableService.sortOrder;
        } else {
            this.tableService.sortColumn = column;
            this.tableService.sortOrder = true;
        }

        const innerText = this._elem.nativeElement.innerText;
        if (this.tableService.sortOrder === true) {
            this._renderer.setElementProperty(
                this._elem.nativeElement,
                'innerHTML',
                innerText + '  <i class="fa fa-sort-alpha-asc" aria-hidden="true"></i>');
        }
        if (this.tableService.sortOrder === false) {
            this._renderer.setElementProperty(
                this._elem.nativeElement,
                'innerHTML',
                innerText + '  <i class="fa fa-sort-alpha-desc" aria-hidden="true"></i>');
        }
        column = this.tableService.sortOrder === true ? [this.tableService.sortColumn] : ['-' + this.tableService.sortColumn];
        this.tableService.notifySortOther(column);
    }
}

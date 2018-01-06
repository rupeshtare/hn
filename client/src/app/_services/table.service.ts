import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TableService {
    private notifyFilter = new Subject<any>();
    private notifySort = new Subject<any>();
    public prevElem = null;
    public sortOrder = null;
    public sortColumn = null;
    /**
     * Observable string streams
     */
    notifyFilterObservable$ = this.notifyFilter.asObservable();
    notifySortObservable$ = this.notifySort.asObservable();

    constructor() { }

    public notifyFilterOther(data: any) {
        if (data) {
            this.notifyFilter.next(data);
        }
    }

    public notifySortOther(data: any) {
        if (data) {
            this.notifySort.next(data);
        }
    }
}

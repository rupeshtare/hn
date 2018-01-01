import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TableService {
    private notifyFilter = new Subject<any>();
    /**
     * Observable string streams
     */
    notifyFilterObservable$ = this.notifyFilter.asObservable();

    constructor() { }

    public notifyFilterOther(data: any) {
        if (data) {
            console.log(data)
            this.notifyFilter.next(data);
        }
    }
}
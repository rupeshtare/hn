import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoaderService {
    private subject = new Subject<any>();
    private state = [];

    constructor() { }

    show() {
        this.state.push(true);
        this.subject.next({ status: true });
    }

    hide() {
        this.state.pop();
        if (this.state.length === 0) {
            this.subject.next({ status: false });
        }
    }

    getStatus(): Observable<any> {
        return this.subject.asObservable();
    }

}

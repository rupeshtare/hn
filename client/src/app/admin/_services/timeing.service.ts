import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class TimeingService {

    constructor(private http: Http) { }

    getById() {
        return this.http.get('/timeing').map((response: Response) => response.json());
    }

    create(menu: object) {
        return this.http.post('/timeing', menu);
    }
}

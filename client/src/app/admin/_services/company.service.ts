import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { Menu } from './../_models/index';

@Injectable()
export class CompanyService {

    constructor(private http: Http) { }

    getAll(params) {
        return this.http.get('/companies', params).map((response: Response) => response);
    }
 
    getById(_id: string) {
        return this.http.get('/companies/' + _id).map((response: Response) => response.json());
    }
 
    create(menu: Menu) {
        return this.http.post('/companies', menu);
    }
 
    update(menu: Menu) {
        return this.http.put('/companies/' + menu._id, menu);
    }
 
    delete(_id: string) {
        return this.http.delete('/companies/' + _id);
    }
}
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Company } from './../_models/index';

@Injectable()
export class CompanyService {

    constructor(private http: Http) { }

    getAll(params) {
        return this.http.get('/companies', params).map((response: Response) => response);
    }

    getById(_id: string) {
        return this.http.get('/companies/' + _id).map((response: Response) => response.json());
    }

    create(menu: Company) {
        return this.http.post('/companies', menu);
    }

    update(menu: Company) {
        return this.http.put('/companies/' + menu._id, menu);
    }

    active(_id: string) {
        return this.http.delete('/companies/active/' + _id);
    }

    deactive(_id: string) {
        return this.http.delete('/companies/deactive/' + _id);
    }
}

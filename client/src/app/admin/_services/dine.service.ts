import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Menu } from './../_models/index';

@Injectable()
export class DineService {

    constructor(private http: Http) { }

    getActive(params) {
        return this.http.get('/dine/current', params).map((response: Response) => response);
    }

    getAll(params) {
        return this.http.get('/dine', params).map((response: Response) => response);
    }

    getById(_id: string) {
        return this.http.get('/dine/' + _id).map((response: Response) => response.json());
    }

    create(menu: Menu) {
        return this.http.post('/dine', menu);
    }

    createOrUpdate(menu: object) {
        return this.http.post('/dine/createOrUpdate', menu);
    }

    remove(menu: object) {
        return this.http.post('/dine/remove', menu);
    }

    update(menu: Menu) {
        return this.http.put('/dine/' + menu._id, menu);
    }

    delete(_id: string) {
        return this.http.delete('/dine/' + _id);
    }
}

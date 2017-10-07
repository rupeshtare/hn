import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { Menu } from './../_models/index';

@Injectable()
export class MessService {

    constructor(private http: Http) { }

    getAllActive(params) {
        return this.http.get('/mess-members/current', params).map((response: Response) => response);
    }

    getAll(params) {
        return this.http.get('/mess-members', params).map((response: Response) => response);
    }
 
    getById(_id: string) {
        return this.http.get('/mess-members/' + _id).map((response: Response) => response.json());
    }
 
    create(menu: Menu) {
        return this.http.post('/mess-members', menu);
    }
  
    createOrUpdateDine(menu: object) {
        return this.http.post('/mess-members/createOrUpdateDine', menu);
    }

    update(menu: Menu) {
        return this.http.put('/mess-members/' + menu._id, menu);
    }

    active(_id: string) {
        return this.http.delete('/mess-members/active/' + _id);
    }

    deactive(_id: string) {
        return this.http.delete('/mess-members/deactive/' + _id);
    }
}
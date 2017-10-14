import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Menu } from './../_models/index';

@Injectable()
export class MenuService {

    constructor(private http: Http) { }

    getAll(params) {
        return this.http.get('/menus', params).map((response: Response) => response);
    }

    getById(_id: string) {
        return this.http.get('/menus/' + _id).map((response: Response) => response.json());
    }

    create(menu: Menu) {
        return this.http.post('/menus', menu);
    }

    update(menu: Menu) {
        return this.http.put('/menus/' + menu._id, menu);
    }

    delete(_id: string) {
        return this.http.delete('/menus/' + _id);
    }

    active(_id: string) {
        return this.http.delete('/menus/active/' + _id);
    }

    deactive(_id: string) {
        return this.http.delete('/menus/deactive/' + _id);
    }
}

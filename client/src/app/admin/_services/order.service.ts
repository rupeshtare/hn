import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from 'rxjs/Rx';

@Injectable()
export class OrderService {

    constructor(private http: Http) { }

    getOrders(params) {
        return this.http.get('/orders/company', params).map((response: Response) => response);
    }

    getAll(params) {
        return this.http.get('/orders', params).map((response: Response) => response);
    }
 
    getById(_id: string) {
        return this.http.get('/orders/' + _id).map((response: Response) => response.json());
    }
 
    create(menu: Object) {
        return this.http.post('/orders', menu);
    }
 
    // update(menu: Menu) {
    //     return this.http.put('/orders/' + menu._id, menu);
    // }
 
    // delete(_id: string) {
    //     return this.http.delete('/orders/' + _id);
    // }
}
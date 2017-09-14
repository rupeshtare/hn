import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { Customer } from './../_models/index';

@Injectable()
export class CustomerService {

    constructor(private http: Http) { }

    getAll() {
        return this.http.get('/customers').map((response: Response) => response);
    }
 
    getById(_id: string) {
        return this.http.get('/customers/' + _id).map((response: Response) => response.json());
    }
 
    create(customer: Customer) {
        return this.http.post('/customers', customer);
    }
 
    update(customer: Customer) {
        return this.http.put('/customers/' + customer._id, customer);
    }
 
    delete(_id: string) {
        return this.http.delete('/customers/' + _id);
    }
}
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Menu } from './../_models/index';
import { DateUtility } from './../../_utils/index';
import * as _ from 'lodash';

@Injectable()
export class MessService {
    public customDays = 'Other';
    public timeingOptions = ['Lunch', 'Dinner', 'Both'];
    public daysOptions = [5, 15, 30, this.customDays];
    public amounts = { 5: 300, 15: 600, 30: 1100, 60: 2000 };
    public defaultDays = 30;

    constructor(
        private http: Http,
        private dateUtility: DateUtility) { }

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

    getLastDate(startDate, days) {
        if (days === this.customDays) {
            days = 1;
        }
        return this.dateUtility.subtractDays(1, this.dateUtility.addDays(days, startDate));
    }

    getPrice(days) {
        const num = this.closestHighest(days, _.keys(this.amounts));
        if (days === num) {
            return this.amounts[num];
        }
        const perDay = _.divide(this.amounts[num], num);
        const price = _.ceil(_.multiply(perDay, days), 2);
        return price;
    }

    private closestHighest(days, arr) {
        arr = arr.map(n => parseInt(n, 10));
        let next = Math.max.apply(Math, arr);
        _.forEach(arr, elem => {
            if (elem >= days && elem < next) {
                next = elem;
            }
        });
        return next;
    }

}

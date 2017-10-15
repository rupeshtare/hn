import { Component } from '@angular/core';
import { OrderService, AlertService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    templateUrl: './order-list.component.html',
})

export class OrderListComponent {
    public orders: Array<object> = [];
    public total = 0;
    public orderColumns: Array<string> = ['customer.firstName', 'customer.lastName', 'order.name',
        'order.price', 'order.quantity', 'order.bill'];
    public defaultColumns: Array<string> = ['customer.firstName', 'order.name', 'order.bill'];


    constructor(
        private orderService: OrderService,
        private alertService: AlertService) { }

    loadOrders(event: object): void {
        this.orderService.getAll(event).subscribe(
            resp => {
                ({ total: this.total, data: this.orders } = resp.json());
            },
            err => {
                this.alertService.error(err);
            });
    }

}

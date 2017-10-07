import { Component } from '@angular/core';
import { OrderService, AlertService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    templateUrl: './order-list.component.html',
})

export class OrderListComponent {
    private orders: Array<object> = [];
    private total: number = 0;
    private orderColumns: Array<string> = ["customer.firstName", "customer.lastName", "order.name", "order.price", "order.quantity", "order.bill"];
    private defaultColumns: Array<string> = ["customer.firstName", "order.name", "order.bill"];
    loading = false;


    constructor(
        private orderService: OrderService,
        private alertService: AlertService) { }

    loadOrders(event: object): void {
        this.loading = true;
        this.orderService.getAll(event).subscribe(
            resp => {
                ({ total: this.total, data: this.orders } = resp.json());
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

}
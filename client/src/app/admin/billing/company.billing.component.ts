import { Component, OnInit } from '@angular/core';
import { OrderService, AlertService } from './../_services/index';
import { Router } from '@angular/router';


@Component({
    templateUrl: './company.billing.component.html',
})

export class CompanyBillingComponent {
    loading : boolean = false;
    totalBill : number = 0;
    private orders: Array<object> = [];
    private orderColumns : Array<string> = ["customer.firstName", "customer.lastName", "total" ];
    private defaultColumns : Array<string> = ["customer.firstName", "total"];
    

    constructor(
        private orderService: OrderService,
        private alertService: AlertService) { }
    
    ngOnInit() : void {
        this.loading = true;
        this.orderService.getOrders(event).subscribe(
            resp => {
                ({data: this.orders} = resp.json());
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        )
    }

}
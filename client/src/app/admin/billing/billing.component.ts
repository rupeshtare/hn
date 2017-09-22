import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CustomerService, OrderService, AlertService } from './../_services/index';
import { Router } from '@angular/router';


@Component({
    templateUrl: './billing.component.html',
})

export class BillingComponent {
    billingForm : FormGroup;
    loading : boolean = false;
    totalBill : number = 0;
    private customers: Array<object> = [];
    private orders: Array<object> = [];
    private orderColumns : Array<string> = ["order.name", "order.price", "order.quantity", "order.bill"];
    private defaultColumns : Array<string> = ["order.name", "order.bill"];
    

    constructor(
        private router: Router,
        private customerService: CustomerService,
        private orderService: OrderService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) { }
    
    ngOnInit() : void {

        this.billingForm = this.formBuilder.group({
            customer : [null, Validators.required]
        })

        this.loading = true;
        this.customerService.getAll(event).subscribe(
            resp => {
                ({data: this.customers} = resp.json());
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        )
    }

    submit(data) {
        this.loading = true;
        this.orderService.getAll({customer: data.customer._id}).subscribe(
            resp => {
                ({data: this.orders} = resp.json());
                this.totalBill = this.orders.reduce((prev,curr)=>{return prev + curr["order"]["bill"];},0)
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        );
    }

}
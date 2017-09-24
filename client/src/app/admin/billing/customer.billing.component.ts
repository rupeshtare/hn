import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CustomerService, OrderService, AlertService } from './../_services/index';
import { Router } from '@angular/router';


@Component({
    templateUrl: './customer.billing.component.html',
})

export class CustomerBillingComponent {
    customerBillingForm : FormGroup;
    loading : boolean = false;
    totalBill : number = 0;
    private customers: Array<object> = [];
    private orders: Array<object> = [];
    private orderColumns : Array<string> = ["order.name", "order.quantity", "order.price", "order.bill"];
    private defaultColumns : Array<string> = ["order.name", "order.bill"];
    

    constructor(
        private router: Router,
        private customerService: CustomerService,
        private orderService: OrderService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) { }
    
    ngOnInit() : void {

        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate()-1);

        this.customerBillingForm = this.formBuilder.group({
            customer : [null, Validators.required],
            startDate : [yesterday, Validators.required],
            endDate : [today, Validators.required]
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
        this.orderService.getAll({
            customer: data.customer._id,
            startDate: data.startDate,
            endDate: data.endDate
        }).subscribe(
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
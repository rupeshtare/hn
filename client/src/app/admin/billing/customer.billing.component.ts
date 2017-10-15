import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService, OrderService, AlertService } from './../_services/index';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Component({
    templateUrl: './customer.billing.component.html',
})

export class CustomerBillingComponent implements OnInit {
    private totalBill = 0;
    public customers: Array<object> = [];
    public orders: Array<object> = [];
    public orderColumns: Array<string> = ['order.name', 'order.quantity', 'order.price', 'order.bill'];
    public defaultColumns: Array<string> = ['order.name', 'order.bill'];
    public customerBillingForm: FormGroup;


    constructor(
        private router: Router,
        private customerService: CustomerService,
        private orderService: OrderService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {

        this.customerBillingForm = this.formBuilder.group({
            customer: [null, Validators.required],
            startDate: [moment().startOf('day').toDate(), Validators.required],
            endDate: [moment().add(1, 'days').startOf('day').toDate(), Validators.required]
        });

        this.customerService.getAll({}).subscribe(
            resp => {
                ({ data: this.customers } = resp.json());
            },
            err => {
                this.alertService.error(err);
            });
    }

    submit(values) {
        this.orderService.getAll(values).subscribe(
            resp => {
                ({ data: this.orders } = resp.json());
                this.totalBill = this.orders.reduce((prev, curr) => prev + curr['order']['bill'], 0);
            },
            err => {
                this.alertService.error(err);
            });
    }

}

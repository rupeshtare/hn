import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService, OrderService, AlertService } from './../_services/index';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Component({
    templateUrl: './company.billing.component.html',
})

export class CompanyBillingComponent implements OnInit {
    private totalBill = 0;
    public companies: Array<object> = [];
    public orders: Array<object> = [];
    public orderColumns: Array<string> = ['_id.firstName', '_id.lastName', 'total'];
    public defaultColumns: Array<string> = ['_id.firstName', 'total'];
    public companyBillingForm: FormGroup;


    constructor(
        private companyService: CompanyService,
        private orderService: OrderService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {

        this.companyBillingForm = this.formBuilder.group({
            company: [null, Validators.required],
            startDate: [moment().startOf('month').toDate(), Validators.required],
            endDate: [moment().add(1, 'days').startOf('day').toDate(), Validators.required]
        });

        this.companyService.getAll({}).subscribe(
            resp => {
                ({ data: this.companies } = resp.json());
            },
            err => {
                this.alertService.error(err);
            });
    }

    submit(values) {
        this.orderService.getOrders(values).subscribe(
            resp => {
                ({ data: this.orders } = resp.json());
            },
            err => {
                this.alertService.error(err);
            });
    }

}

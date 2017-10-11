import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService, OrderService, AlertService } from './../_services/index';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Component({
    templateUrl: './company.billing.component.html',
})

export class CompanyBillingComponent {
    companyBillingForm: FormGroup;
    loading: boolean = false;
    totalBill: number = 0;
    private companies: Array<object> = [];
    private orders: Array<object> = [];
    private orderColumns: Array<string> = ["_id.firstName", "_id.lastName", "total"];
    private defaultColumns: Array<string> = ["_id.firstName", "total"];


    constructor(
        private companyService: CompanyService,
        private orderService: OrderService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {

        this.companyBillingForm = this.formBuilder.group({
            company: [null, Validators.required],
            startDate: [moment().startOf('month').toDate(), Validators.required],
            endDate: [moment().add(1, "days").startOf('day').toDate(), Validators.required]
        })

        this.loading = true;
        this.companyService.getAll({}).subscribe(
            resp => {
                ({ data: this.companies } = resp.json());
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    submit(data) {
        this.loading = true;
        this.orderService.getOrders(data).subscribe(
            resp => {
                ({ data: this.orders } = resp.json());
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

}
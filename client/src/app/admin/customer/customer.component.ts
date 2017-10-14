import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService, CustomerService, CompanyService } from './../_services/index';
import * as moment from 'moment';


@Component({
    templateUrl: './customer.component.html',
})

export class CustomerComponent implements OnInit {
    private loading = false;
    public companies: Array<object> = [];
    public employeeTypeOptions = ['Employee', 'Contractor', 'Guest'];
    public customerForm: FormGroup;


    constructor(
        private router: Router,
        private customerService: CustomerService,
        private alertService: AlertService,
        private formBuilder: FormBuilder,
        private companyService: CompanyService) {

        this.customerForm = formBuilder.group({
            company: [null, Validators.required],
            firstName: [null, Validators.required],
            middleName: '',
            lastName: [null, Validators.required],
            mobile: [null, Validators.required],
            dob: moment().toDate(),
            email: '',
            employeeType: this.employeeTypeOptions[0],
        });
    }

    ngOnInit(): void {

        this.loading = true;
        this.companyService.getAll({ active: true, include: ['name'] }).subscribe(
            resp => {
                ({ data: this.companies } = resp.json());
            },
            err => {
                this.alertService.error(err);
                this.loading = false;
            });
    }

    submit(value) {
        this.loading = true;
        this.customerService.create(value)
            .subscribe(
            data => {
                this.router.navigate(['/admin/customers']);
            },
            err => {
                this.alertService.error(err);
                this.loading = false;
            });
    }

}

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
            firstName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
            middleName: ['', Validators.maxLength(20)],
            lastName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
            mobile: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],
            dob: moment().toDate(),
            email: ['', [Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
            employeeType: this.employeeTypeOptions[0],
        });
    }

    ngOnInit(): void {

        this.companyService.getAll({ active: true, include: ['name'] }).subscribe(
            resp => {
                ({ data: this.companies } = resp.json());
            },
            err => {
                this.alertService.error(err);
            });
    }

    submit(value) {
        this.customerService.create(value)
            .subscribe(
            data => {
                this.router.navigate(['/admin/customers']);
            },
            err => {
                this.alertService.error(err);
            });
    }

}

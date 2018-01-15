import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, CustomerService, CompanyService } from './../_services/index';
import * as moment from 'moment';


@Component({
    templateUrl: './customer-update.component.html',
})

export class CustomerUpdateComponent implements OnInit {
    private _id: string;
    public companies: Array<object> = [];
    public employeeTypeOptions = ['Staff', 'Worker', 'Contractor', 'Guest'];
    public customerForm: FormGroup;


    constructor(
        private router: Router,
        private route: ActivatedRoute,
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
            dob: '',
            email: ['', [Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
            employeeType: '',
            active: null,
        });

        this.route.params.subscribe(params => {
            this._id = params._id;
        });
    }

    ngOnInit() {

        this.customerService.getById(this._id)
            .subscribe(
            data => {
                this.customerForm.patchValue({
                    company: data.company,
                    firstName: data.firstName,
                    middleName: data.middleName,
                    lastName: data.lastName,
                    mobile: data.mobile,
                    dob: data.dob ? moment(data.dob).toDate() : moment().toDate(),
                    email: data.email,
                    employeeType: data.employeeType,
                    active: data.active,
                });
            },
            err => {
                this.alertService.error(err);
            });

        this.companyService.getAll({ active: true, include: ['name'] }).subscribe(
            resp => {
                ({ data: this.companies } = resp.json());
            },
            err => {
                this.alertService.error(err);
            });
    }

    update(value) {
        value._id = this._id;
        this.customerService.update(value)
            .subscribe(
            data => {
                this.router.navigate(['/admin/customers']);
            },
            err => {
                this.alertService.error(err);
            });
    }

    byCompanyName(item1: object, item2: object) {
        return item1['name'] === item2['name'];
    }

    deactive() {
        this.customerService.deactive(this._id)
            .subscribe(
            data => {
                this.router.navigate(['/admin/customers']);
            },
            err => {
                this.alertService.error(err);
            });
    }

    active() {
        this.customerService.active(this._id)
            .subscribe(
            data => {
                this.router.navigate(['/admin/customers']);
            },
            err => {
                this.alertService.error(err);
            });
    }

}

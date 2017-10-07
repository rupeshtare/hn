import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService, CustomerService, CompanyService } from './../_services/index';


@Component({
    templateUrl: './customer.component.html',
})

export class CustomerComponent {
    customerForm: FormGroup;
    loading = false;
    private companies: Array<object> = [];
    employeeTypeOptions = ['Employee', 'Contractor', 'Guest'];


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
            dob: '',
            email: '',
            employeeType: '',
            active: true,
        })
    }

    ngOnInit(): void {

        this.loading = true;
        this.companyService.getAll({active: true, include: ['name'] }).subscribe(
            resp => {
                ({ data: this.companies } = resp.json());
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        )
    }

    submit(data) {
        this.loading = true;
        this.customerService.create(data)
            .subscribe(
            data => {
                this.router.navigate(['/admin/customers']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
            );
    }

}
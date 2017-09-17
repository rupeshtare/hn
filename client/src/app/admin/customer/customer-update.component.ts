import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, CustomerService } from './../_services/index';
 

@Component({
    templateUrl: './customer-update.component.html',
})

export class CustomerUpdateComponent implements OnInit {
    _id: string;
    customerForm : FormGroup;
    loading = false;
    employeeTypeOptions = ['Employee', 'Contractor', 'Guest'];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private customerService: CustomerService,
        private alertService: AlertService,
        private formBuilder: FormBuilder){

            this.customerForm = formBuilder.group({
                company : [null, Validators.required],
                firstName : [null, Validators.required],
                middleName : '',
                lastName : [null, Validators.required],
                mobile : [null, Validators.required],
                dob : '',
                email : '',
                employeeType : '',
                active : true,
            })

            this.route.params.subscribe(params=>{
                this._id = params._id;
            })
        }

    ngOnInit() {
        this.customerService.getById(this._id)
        .subscribe(
            data => {
                this.customerForm.patchValue({
                    company : data.company,
                    firstName : data.firstName,
                    middleName : data.middleName,
                    lastName : data.lastName,
                    mobile : data.mobile,
                    dob : data.dob,
                    email : data.email,
                    employeeType : data.employeeType,
                    active : data.active,
                });
            },
            error => {
                this.alertService.error(error);
            }
        )
    }
    
    update(value) {
        this.loading = true;
        value._id = this._id;
        this.customerService.update(value)
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
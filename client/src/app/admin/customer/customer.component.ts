import { Component } from '@angular/core';
import { NgForm as ngForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService, CustomerService } from './../_services/index';
 

@Component({
    templateUrl: './customer.component.html',
})

export class CustomerComponent {
    model: any = {}; 
    loading = false;

    constructor(
        private router: Router,
        private customerService: CustomerService,
        private alertService: AlertService){ }

    submit() {
        this.loading = true;
        this.customerService.create(this.model)
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
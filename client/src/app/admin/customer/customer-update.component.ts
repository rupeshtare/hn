import { Component, OnInit } from '@angular/core';
import { NgForm as ngForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, CustomerService } from './../_services/index';
 

@Component({
    templateUrl: './customer-update.component.html',
})

export class CustomerUpdateComponent implements OnInit {
    _id: string;
    model: any = {}; 
    loading = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private customerService: CustomerService,
        private alertService: AlertService){
            this.route.params.subscribe(params=>{
                this._id = params._id;
            })
        }

    ngOnInit() {
        this.customerService.getById(this._id)
        .subscribe(
            data => {
                this.model = data;
            },
            error => {
                this.alertService.error(error);
            }
        )
    }
    
    update() {
        this.loading = true;
        this.customerService.update(this.model)
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
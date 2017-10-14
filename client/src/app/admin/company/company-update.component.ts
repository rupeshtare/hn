import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { CompanyService, AlertService } from './../_services/index';


@Component({
    templateUrl: './company-update.component.html',
})

export class CompanyUpdateComponent implements OnInit {
    private _id: string;
    private loading = false;
    public companyForm: FormGroup;


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private companyService: CompanyService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) {

        this.route.params.subscribe(params => {
            this._id = params._id;
        });

        this.companyForm = this.formBuilder.group({
            name: [null, Validators.required],
            active: null
        });
    }

    ngOnInit(): void {

        this.companyService.getById(this._id)
            .subscribe(
            data => {
                this.companyForm.patchValue({
                    name: data.name,
                    active: data.active
                });
            },
            err => {
                this.alertService.error(err);
            });
    }

    update(value) {
        this.loading = true;
        value._id = this._id;
        this.companyService.update(value)
            .subscribe(
            data => {
                this.router.navigate(['/admin/companies']);
            },
            err => {
                this.alertService.error(err);
                this.loading = false;
            });
    }

    deactive() {
        this.loading = true;
        this.companyService.deactive(this._id)
            .subscribe(
            data => {
                this.router.navigate(['/admin/companies']);
            },
            err => {
                this.alertService.error(err);
                this.loading = false;
            });
    }

    active() {
        this.loading = true;
        this.companyService.active(this._id)
            .subscribe(
            data => {
                this.router.navigate(['/admin/companies']);
            },
            err => {
                this.alertService.error(err);
                this.loading = false;
            });
    }
}

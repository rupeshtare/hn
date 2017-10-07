import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService, AlertService } from './../_services/index';
import { Router } from '@angular/router';


@Component({
    templateUrl: './company.component.html',
})

export class CompanyComponent {
    companyForm: FormGroup;
    loading: boolean = false;


    constructor(
        private router: Router,
        private companyService: CompanyService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {

        this.companyForm = this.formBuilder.group({
            name: [null, Validators.required]
        })
    }

    submit(data) {
        this.loading = true;
        this.companyService.create(data)
            .subscribe(
            data => {
                this.router.navigate(['/admin/companies']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

}
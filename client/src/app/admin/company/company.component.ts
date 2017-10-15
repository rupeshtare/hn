import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService, AlertService } from './../_services/index';
import { Router } from '@angular/router';


@Component({
    templateUrl: './company.component.html',
})

export class CompanyComponent implements OnInit {
    public companyForm: FormGroup;


    constructor(
        private router: Router,
        private companyService: CompanyService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {

        this.companyForm = this.formBuilder.group({
            name: [null, Validators.required]
        });
    }

    submit(values) {
        this.companyService.create(values)
            .subscribe(
            data => {
                this.router.navigate(['/admin/companies']);
            },
            err => {
                this.alertService.error(err);
            });
    }

}

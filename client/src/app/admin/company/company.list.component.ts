import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService, AlertService } from './../_services/index';
import { Router } from '@angular/router';


@Component({
    templateUrl: './company.list.component.html',
})

export class CompanyListComponent {
    companyForm: FormGroup;
    loading: boolean = false;
    private companies: Array<object> = [];
    private companyColumns: Array<string> = ["name", "active"];
    private defaultColumns: Array<string> = ["name"];


    constructor(
        private router: Router,
        private companyService: CompanyService,
        private alertService: AlertService) { }

    loadCompnies(event: object): void {
        this.loading = true;
        this.companyService.getAll(event).subscribe(
            resp => {
                ({ data: this.companies } = resp.json());
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        )
    }

}
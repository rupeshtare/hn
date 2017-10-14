import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService, AlertService } from './../_services/index';
import { Router } from '@angular/router';


@Component({
    templateUrl: './company.list.component.html',
})

export class CompanyListComponent {
    private loading = false;
    public total = 0;
    public companies: Array<object> = [];
    public companyColumns: Array<string> = ['name', 'active'];
    public defaultColumns: Array<string> = ['name'];
    public companyForm: FormGroup;


    constructor(
        private router: Router,
        private companyService: CompanyService,
        private alertService: AlertService) { }

    loadCompnies(event: object): void {
        this.loading = true;
        this.companyService.getAll(event).subscribe(
            resp => {
                ({ total: this.total, data: this.companies } = resp.json());
            },
            err => {
                this.alertService.error(err);
                this.loading = false;
            });
    }

}

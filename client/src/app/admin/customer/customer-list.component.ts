import { Component } from '@angular/core';
import { CustomerService, AlertService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    templateUrl: './customer-list.component.html',
})

export class CustomerListComponent {
    public customers: Array<object> = [];
    public total = 0;
    public customersColumns: Array<string> = ['firstName', 'middleName', 'lastName',
        'active', 'mobile', 'company.name', 'dob', 'employeeType'];
    public defaultColumns: Array<string> = ['firstName', 'lastName'];


    constructor(
        private customerService: CustomerService,
        private alertService: AlertService) { }

    loadCustomers(event: object): void {
        this.customerService.getAll(event).subscribe(
            resp => {
                ({ total: this.total, data: this.customers } = resp.json());
            },
            err => {
                this.alertService.error(err);
            });
    }

}

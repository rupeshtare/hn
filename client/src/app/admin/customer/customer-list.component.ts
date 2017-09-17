import { Component } from '@angular/core';
import { CustomerService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    templateUrl: './customer-list.component.html',
})

export class CustomerListComponent { 
    private customers : Array<object> = [];
    private customersColumns : Array<string> = ['firstName', 'middleName', 'lastName', 'mobile', 'company', 'dob', 'employeeType'];
    private defaultColumns : Array<string> = ['firstName', 'lastName']
    loading = false;

    constructor(private customerService: CustomerService) { }

    loadCustomers(event: object) : void {
        this.loading = true;
        this.customerService.getAll(event).subscribe(
            resp => {
                this.customers = resp.json();
            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log("Client-side error occured.");
                } else {
                    console.log("Server-side error occured.");
                }
            }
        )
    }
}
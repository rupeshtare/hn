import { Component, OnInit } from '@angular/core';
import { CustomerService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    templateUrl: './customer-list.component.html',
})

export class CustomerListComponent implements OnInit { 
    private customers: any[] = [];
    loading = false;

    constructor(private customerService: CustomerService) { }

    ngOnInit() {
        this.loading = true;
        this.customerService.getAll().subscribe(
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
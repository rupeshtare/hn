import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService, MessService, AlertService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
    templateUrl: './mess-member.component.html',
})

export class MessMemberComponent implements OnInit {
    messMemberForm : FormGroup;
    loading : boolean = false;
    timeingOptions = ['Lunch', 'Dinner', 'Both'];
    daysOptions = [15, 30];
    private customers: Array<object> = [];


    constructor(
        private router: Router,
        private customerService: CustomerService,
        private messMemberService: MessService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) { }
    
    ngOnInit() : void {

        this.messMemberForm = this.formBuilder.group({
            customer : [null, Validators.required],
            timeing : 'Lunch',
            days : '30',
            active : true,
            startDate : moment(),
            endDate : moment().add(29, 'days')
        })

        this.messMemberForm.get("days").valueChanges.subscribe(data=>{
            this.changeLastDate(data);
        });

        this.loading = true;
        this.customerService.getAll({include: ['firstName', 'lastName', 'company.name']}).subscribe(
            resp => {
                ({data: this.customers} = resp.json());
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

    submit(data) {
        this.loading = true;
        this.messMemberService.create(data)
        .subscribe(
            data => {
                this.router.navigate(['/admin/mess-members']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        );
    }

    changeLastDate(days) {
        this.messMemberForm.patchValue({
            endDate: moment().add(parseInt(days), "days").subtract(1, "days"),
        });
    }

}
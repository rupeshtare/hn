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
    public messMemberForm: FormGroup;
    public timeingOptions = ['Lunch', 'Dinner', 'Both'];
    public daysOptions = [15, 30];
    public customers: Array<object> = [];


    constructor(
        private router: Router,
        private customerService: CustomerService,
        private messMemberService: MessService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {

        this.messMemberForm = this.formBuilder.group({
            customer: [null, Validators.required],
            timeing: 'Lunch',
            days: '30',
            startDate: moment(),
            endDate: moment().add(29, 'days')
        });

        this.messMemberForm.get('days').valueChanges.subscribe(data => {
            this.changeLastDate(data);
        });

        this.customerService.getAll({ active: true, include: ['firstName', 'lastName', 'company.name'] }).subscribe(
            resp => {
                ({ data: this.customers } = resp.json());
            },
            err => {
                this.alertService.error(err);
            });
    }

    submit(values) {
        this.messMemberService.create(values)
            .subscribe(
            data => {
                this.router.navigate(['/admin/mess-members']);
            },
            err => {
                this.alertService.error(err);
            });
    }

    changeLastDate(days) {
        this.messMemberForm.patchValue({
            endDate: moment().add(parseInt(days, 10), 'days').subtract(1, 'days'),
        });
    }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService, MessService, AlertService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
    templateUrl: './mess-member-update.component.html',
})

export class MessMemberUpdateComponent implements OnInit {
    messMemberForm: FormGroup;
    _id: string;
    loading: boolean = false;
    timeingOptions = ['Lunch', 'Dinner', 'Both'];
    daysOptions = [15, 30];
    private customers: Array<object> = [];


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private customerService: CustomerService,
        private messMemberService: MessService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) {

        this.route.params.subscribe(params => {
            this._id = params._id;
        })

        this.messMemberForm = this.formBuilder.group({
            customer: [null, Validators.required],
            timeing: 'Lunch',
            days: '30',
            startDate: moment(),
            endDate: moment().add(29, 'days'),
            active: null
        })

    }

    ngOnInit(): void {

        this.messMemberForm.get("days").valueChanges.subscribe(data => {
            this.changeLastDate(data);
        });

        this.customerService.getAll({ include: ['firstName', 'lastName', 'company.name'] }).subscribe(
            resp => {
                ({ data: this.customers } = resp.json());
            },
            err => {
                this.alertService.error(err);
            }
        )

        this.messMemberService.getById(this._id)
            .subscribe(
            data => {
                this.messMemberForm.patchValue({
                    customer: data.customer,
                    timeing: data.timeing,
                    days: data.days,
                    startDate: moment(data.startDate),
                    endDate: moment(data.endDate),
                    active: data.active
                });
            },
            err => {
                this.alertService.error(err);
            });
    }

    update(data) {
        this.loading = true;
        data._id = this._id;
        this.messMemberService.update(data)
            .subscribe(
            data => {
                this.router.navigate(['/admin/mess-members']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    changeLastDate(days) {
        this.messMemberForm.patchValue({
            endDate: moment().add(parseInt(days), "days").subtract(1, "days"),
        });
    }

    byUserName(item1: object, item2: object) {
        return item1["firstName"] === item2["firstName"];
    }

    deactive() {
        this.loading = true;
        this.messMemberService.deactive(this._id)
            .subscribe(
            data => {
                this.router.navigate(['/admin/mess-members']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    active() {
        this.loading = true;
        this.messMemberService.active(this._id)
            .subscribe(
            data => {
                this.router.navigate(['/admin/mess-members']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

}
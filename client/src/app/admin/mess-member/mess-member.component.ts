import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISubscription } from 'rxjs/Subscription';
import { CustomerService, MessService, AlertService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DateUtility } from './../../_utils/index';
import * as _ from 'lodash';

@Component({
    templateUrl: './mess-member.component.html',
})

export class MessMemberComponent implements OnInit, OnDestroy {
    public customDays: string;
    private defaultDays: number;
    private amounts: object;
    public timeingOptions: Array<string>;
    public daysOptions: Array<any>;
    public customers: Array<object> = [];
    public messMemberForm: FormGroup;
    private daysSub: ISubscription;
    private customDaysSub: ISubscription;
    private timeingSub: ISubscription;


    constructor(
        private router: Router,
        private customerService: CustomerService,
        private messMemberService: MessService,
        private alertService: AlertService,
        private formBuilder: FormBuilder,
        private dateUtility: DateUtility) { }

    ngOnInit(): void {

        this.customDays = this.messMemberService.customDays;
        this.timeingOptions = this.messMemberService.timeingOptions;
        this.daysOptions = this.messMemberService.daysOptions;
        this.amounts = this.messMemberService.amounts;
        this.defaultDays = this.messMemberService.defaultDays;

        this.messMemberForm = this.formBuilder.group({
            customer: [null, Validators.required],
            timeing: this.timeingOptions[0],
            days: this.defaultDays.toString(),
            customDays: [0, Validators.required],
            price: this.amounts[this.defaultDays],
            recursive: false,
            startDate: this.dateUtility.startOfDay(),
            endDate: this.dateUtility.addDays(this.defaultDays - 1)
        });

        this.daysSub = this.messMemberForm.get('days').valueChanges.subscribe(data => {
            this.changeLastDate(data);
            this.changePrice();
        });

        this.customDaysSub = this.messMemberForm.get('customDays').valueChanges.subscribe(data => {
            this.changeLastDate(data);
            this.changePrice();
        });

        this.timeingSub = this.messMemberForm.get('timeing').valueChanges.subscribe(data => {
            this.changePrice();
        });

        this.customerService.getAll({
            active: true, include: ['firstName', 'lastName', 'company.name'],
            sort: ['+firstName', '+lastName']
        }).subscribe(
            resp => {
                ({ data: this.customers } = this.customerService.fullName(resp.json()));
            },
            err => {
                this.alertService.error(err);
            });
    }

    ngOnDestroy() {
        this.daysSub.unsubscribe();
        this.customDaysSub.unsubscribe();
        this.timeingSub.unsubscribe();
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
        if (days === this.customDays) {
            days = 0;
        }
        const startDate = this.messMemberForm.get('startDate').value;
        this.messMemberForm.patchValue({
            endDate: this.messMemberService.getLastDate(startDate, days)
        });
    }

    private changePrice() {
        let days = this.messMemberForm.get('days').value;
        if (days === this.customDays) {
            days = this.messMemberForm.get('customDays').value;
        }

        if (this.messMemberForm.get('timeing').value === 'Both') {
            days = days * 2;
        }

        const price = this.messMemberService.getPrice(days);

        this.messMemberForm.patchValue({
            price
        });
    }

}

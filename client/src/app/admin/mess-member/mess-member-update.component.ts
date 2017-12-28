import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISubscription } from 'rxjs/Subscription';
import { CustomerService, MessService, AlertService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DateUtility } from './../../_utils/index';

@Component({
    templateUrl: './mess-member-update.component.html',
})

export class MessMemberUpdateComponent implements OnInit, OnDestroy {
    private _id: string;
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
        private route: ActivatedRoute,
        private customerService: CustomerService,
        private messMemberService: MessService,
        private alertService: AlertService,
        private dateUtility: DateUtility,
        private formBuilder: FormBuilder) {

        this.customDays = this.messMemberService.customDays;
        this.timeingOptions = this.messMemberService.timeingOptions;
        this.daysOptions = this.messMemberService.daysOptions;
        this.amounts = this.messMemberService.amounts;
        this.defaultDays = this.messMemberService.defaultDays;

        this.route.params.subscribe(params => {
            this._id = params._id;
        });

        this.messMemberForm = this.formBuilder.group({
            customer: [{}, Validators.required],
            timeing: this.timeingOptions[0],
            days: this.defaultDays.toString(),
            customDays: [0, Validators.required],
            price: this.amounts[this.defaultDays],
            startDate: this.dateUtility.startOfDay(),
            endDate: this.dateUtility.addDays(this.defaultDays - 1),
            active: null
        });

    }

    ngOnInit(): void {

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

        this.customerService.getAll({ include: ['firstName', 'lastName', 'company.name'] }).subscribe(
            resp => {
                ({ data: this.customers } = resp.json());
            },
            err => {
                this.alertService.error(err);
            });

        this.messMemberService.getById(this._id)
            .subscribe(
            data => {
                this.messMemberForm.patchValue({
                    customer: data.customer,
                    timeing: data.timeing,
                    days: data.days,
                    customDays: data.customDays,
                    price: data.price,
                    startDate: this.dateUtility.startOfDay(data.startDate),
                    endDate: this.dateUtility.startOfDay(data.endDate),
                    active: data.active
                });
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

    update(values) {
        values._id = this._id;
        this.messMemberService.update(values)
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
            days = this.messMemberForm.get('customDays').value;
            days = days ? days : 0;
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

    byUserName(item1: object, item2: object) {
        return item1['firstName'] === item2['firstName'];
    }

    deactive() {
        this.messMemberService.deactive(this._id)
            .subscribe(
            data => {
                this.router.navigate(['/admin/mess-members']);
            },
            err => {
                this.alertService.error(err);
            });
    }

    active() {

        this.messMemberService.active(this._id)
            .subscribe(
            data => {
                this.router.navigate(['/admin/mess-members']);
            },
            err => {
                this.alertService.error(err);

            });
    }

}

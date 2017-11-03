import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimeingService, AlertService } from './../_services/index';
import { Router } from '@angular/router';


@Component({
    templateUrl: './timeing.component.html',
})

export class TimeingComponent implements OnInit {
    public availableOptions = ['Morning', 'Noon', 'Evening', 'Night'];
    public timeingForm: FormGroup;


    constructor(
        private router: Router,
        private timeingService: TimeingService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) {

        this.timeingForm = this.formBuilder.group({
            morningStart: null,
            morningEnd: null,
            noonStart: null,
            noonEnd: null,
            eveningStart: null,
            eveningEnd: null,
            nightStart: null,
            nightEnd: null,
        });
    }

    ngOnInit(): void {

        this.timeingService.getById()
            .subscribe(
            data => {
                this.timeingForm.patchValue({
                    morningStart: data.morningStart,
                    morningEnd: data.morningEnd,
                    noonStart: data.noonStart,
                    noonEnd: data.noonEnd,
                    eveningStart: data.eveningStart,
                    eveningEnd: data.eveningEnd,
                    nightStart: data.nightStart,
                    nightEnd: data.nightEnd,
                });
            },
            err => {
                this.alertService.error(err);
            });
    }

    submit(values) {
        this.timeingService.create(values)
            .subscribe(
            data => {
                this.router.navigate(['/admin/timeing']);
            },
            err => {
                this.alertService.error(err);
            });
    }

}

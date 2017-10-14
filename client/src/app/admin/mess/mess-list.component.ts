import { Component, OnInit } from '@angular/core';
import { MessService, DineService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from './../_services/index';
import * as moment from 'moment';
import * as _ from 'lodash';


@Component({
    templateUrl: './mess-list.component.html',
})

export class MessListComponent implements OnInit {
    private loading = false;
    public messMembers: Array<object> = [];
    public dineMembers: object = { members: [] };
    public total = 0;
    public messMemberColumns: Array<string> = ['customer.firstName', 'customer.lastName', 'createdOn'];
    public defaultColumns: Array<string> = ['customer.firstName', 'customer.lastName'];
    public selectedDine: object = null;


    constructor(
        private messMemberService: MessService,
        private dineService: DineService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.loading = true;
        this.dineService.getActive({ include: ['members'] }).subscribe(
            resp => {
                this.dineMembers = resp.json().data ? resp.json().data : this.dineMembers;
            },
            err => {
                this.alertService.error(err.name);
            });
    }

    loadMessMembers(event: object): void {
        this.loading = true;
        this.messMemberService.getAllActive({ include: ['customer'] }).subscribe(
            resp => {
                ({ total: this.total, data: this.messMembers } = resp.json());
                // Filter mess members who had dinner or lunch
                this.messMembers = this.messMembers.filter(messObj => {
                    if (this.dineMembers['members'].every(dineObj => dineObj['_id'] !== messObj['_id'])) {
                        return messObj;
                    }
                });
            },
            err => {
                this.alertService.error('Server-side error occured.');
            });
    }

    selectMember(event: object) {
        this.messMembers = this.messMembers.filter(obj => { if (obj['_id'] !== event['_id']) { return obj; } });
        this.dineService.createOrUpdate(event).subscribe(
            resp => {
                _.subtract(this.total, 1);
                event = _.merge(event, { 'createdOn': moment().format() });
                this.dineMembers['members'] = _.concat(this.dineMembers['members'], event);
                this.alertService.success(event['customer'].firstName + ' ' + event['customer'].lastName + ' added successfully');
            },
            err => {
                this.alertService.error('Server-side error occured.');
            });
    }

    selectDine(event: object) {
        this.selectedDine = event;
    }

    unselectDine() {
        this.selectedDine = null;
    }

    removeMember() {
        this.dineService.remove(this.selectedDine).subscribe(
            resp => {
                _.omit(this.selectedDine, ['createdBy', 'createdOn']);
                _.add(this.total, 1);
                this.messMembers = _.concat(this.messMembers, this.selectedDine);
                _.remove(this.dineMembers['members'], member => member['_id'] === this.selectedDine['_id']);
                this.alertService.error(this.selectedDine['customer'].firstName + ' ' +
                    this.selectedDine['customer'].lastName + ' removed successfully');
                this.selectedDine = null;
            },
            err => {
                this.alertService.error('Server-side error occured.');
            });
    }

}

import { Component } from '@angular/core';
import { MessService, AlertService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    templateUrl: './mess-member-list.component.html',
})

export class MessMemberListComponent {
    private loading = false;
    public messMembers: Array<object> = [];
    public total = 0;
    public messMemberColumns: Array<string> = ['customer.firstName', 'customer.lastName', 'timeing',
        'days', 'startDate', 'endDate', 'active'];
    public defaultColumns: Array<string> = ['customer.firstName', 'customer.lastName', 'timeing'];


    constructor(
        private messMemberService: MessService,
        private alertService: AlertService) { }

    loadMessMembers(event: object): void {
        this.loading = true;
        this.messMemberService.getAll(event).subscribe(
            resp => {
                ({ total: this.total, data: this.messMembers } = resp.json());
            },
            err => {
                this.alertService.error(err);
            });
    }

}

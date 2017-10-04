import { Component } from '@angular/core';
import { MessService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    templateUrl: './mess-member-list.component.html',
})

export class MessMemberListComponent { 
    private messMembers: Array<object> = [];
    private total : number = 0;
    private messMemberColumns : Array<string> = ["customer.firstName", "customer.lastName", "timeing", "days", "startDate", "endDate", "active"];
    private defaultColumns : Array<string> = ["customer.firstName", "customer.lastName", "timeing",];
    loading = false;


    constructor(private messMemberService: MessService) { }

    loadMessMembers(event: object) : void {
        this.loading = true;
        this.messMemberService.getAll(event).subscribe(
            resp => {
                ({total: this.total, data: this.messMembers} = resp.json());
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
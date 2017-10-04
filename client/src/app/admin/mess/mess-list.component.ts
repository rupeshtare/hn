import { Component, OnInit } from '@angular/core';
import { MessService, DineService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from './../_services/index';


@Component({
    templateUrl: './mess-list.component.html',
})

export class MessListComponent implements OnInit { 
    private messMembers: Array<object> = [];
    private dineMembers : object = {members: []};
    private total : number = 0;
    private messMemberColumns : Array<string> = ["customer.firstName", "customer.lastName", "timeing", "days", "startDate", "endDate", "active"];
    private defaultColumns : Array<string> = ["customer.firstName", "customer.lastName", "timeing",];
    private loading = false;


    constructor(
        private messMemberService: MessService,
        private dineService: DineService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.loading = true;
        this.dineService.getActive({}).subscribe(
            resp => {
                this.dineMembers = resp.json().data ? resp.json().data : this.dineMembers;
            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log("Client-side error occured.");
                } else {
                    this.alertService.error(err.name);
                }
            }
        )

    }

    loadMessMembers(event: object) : void {
        this.loading = true;
        this.messMemberService.getAllActive(event).subscribe(
            resp => {
                ({total: this.total, data: this.messMembers} = resp.json());
                // Filter mess members who had dinner or lunch
                this.messMembers = this.messMembers.filter(messObj=>{
                    if(this.dineMembers["members"].every(dineObj=>{
                        return dineObj["_id"] !== messObj["_id"];
                    }))
                    return messObj;
                });
            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log("Client-side error occured.");
                } else {
                    this.alertService.error("Server-side error occured.");
                }
            }
        )
    }

    selectMember(event: object){
        this.messMembers = this.messMembers.filter(obj=>{if(obj["_id"] !== event["_id"]) return obj;})
        this.dineService.createOrUpdate(event).subscribe(
            resp => {
                this.total -= 1;
                this.dineMembers["members"].push(event);
                this.alertService.success(event["customer"].firstName +" "+ event["customer"].lastName + " added successfully");
            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log("Client-side error occured.");
                } else {
                    this.alertService.error("Server-side error occured.");
                }
            }
        )
    }

}
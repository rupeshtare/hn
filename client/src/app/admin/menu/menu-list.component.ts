import { Component, OnInit } from '@angular/core';
import { MenuService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    templateUrl: './menu-list.component.html',
})


export class MenuListComponent implements OnInit { 
    private menus: Array<object> = [];
    private menuColumns : Array<string> = ["name", "price"];
    loading = false;

    constructor(private menuService: MenuService) { }

    ngOnInit() {
        this.loading = true;
        this.menuService.getAll().subscribe(
            resp => {
                this.menus = resp.json();
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
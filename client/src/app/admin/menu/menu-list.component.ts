import { Component } from '@angular/core';
import { MenuService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    templateUrl: './menu-list.component.html',
})


export class MenuListComponent { 
    private menus: Array<object> = [];
    private total : number = 0;
    private menuColumns : Array<string> = ["name", "price", "active", "available", "category", "subCategory", "tasteType", "subTasteType"];
    private defaultColumns : Array<string> = ["name", "price"];
    loading = false;

    constructor(private menuService: MenuService) { }

    loadMenus(event: object) : void {
        this.loading = true;
        this.menuService.getAll(event).subscribe(
            resp => {
                ({total: this.total, data: this.menus} = resp.json());
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
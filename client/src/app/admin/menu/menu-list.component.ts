import { Component } from '@angular/core';
import { AlertService, MenuService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    templateUrl: './menu-list.component.html',
})


export class MenuListComponent {
    public menus: Array<object> = [];
    public total = 0;
    public menuColumns: Array<string> = ['name', 'price', 'active', 'available', 'category', 'subCategory', 'tasteType', 'subTasteType'];
    public defaultColumns: Array<string> = ['name', 'price'];


    constructor(
        private menuService: MenuService,
        private alertService: AlertService) { }

    loadMenus(event: object): void {
        this.menuService.getAll(event).subscribe(
            resp => {
                ({ total: this.total, data: this.menus } = resp.json());
            },
            err => {
                this.alertService.error(err);
            });
    }

}

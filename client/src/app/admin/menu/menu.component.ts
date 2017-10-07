import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService, MenuService } from './../_services/index';


@Component({
    templateUrl: './menu.component.html',
})

export class MenuComponent {
    menuForm: FormGroup;
    loading: boolean = false;
    availableOptions = ['Morning', 'Noon', 'Evening', 'Night'];
    tasteTypeOptions = ['Spicy', 'Sweet', 'Salty', 'Sweet N Salty'];
    subTasteTypeOptions = ['Normal', 'Medium', 'High'];


    constructor(
        private router: Router,
        private menuService: MenuService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) {

        this.menuForm = formBuilder.group({
            name: [null, Validators.required],
            price: [null, Validators.required],
            available: formBuilder.group(
                this.availableOptions.reduce((prev, curr) => { prev[curr] = [false, []]; return prev; }, {})
            ),
            category: '',
            subCategory: '',
            tasteType: '',
            subTasteType: ''
        })
    }

    submit(data) {
        this.loading = true;
        this.menuService.create(data)
            .subscribe(
            data => {
                this.router.navigate(['/admin/menus']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

}
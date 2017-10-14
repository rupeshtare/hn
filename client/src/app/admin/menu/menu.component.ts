import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService, MenuService } from './../_services/index';


@Component({
    templateUrl: './menu.component.html',
})

export class MenuComponent {
    private loading = false;
    public availableOptions = ['Morning', 'Noon', 'Evening', 'Night'];
    public tasteTypeOptions = ['Spicy', 'Sweet', 'Salty', 'Sweet N Salty'];
    public subTasteTypeOptions = ['Normal', 'Medium', 'High'];
    public menuForm: FormGroup;


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
        });
    }

    submit(values) {
        this.loading = true;
        this.menuService.create(values)
            .subscribe(
            data => {
                this.router.navigate(['/admin/menus']);
            },
            err => {
                this.alertService.error(err);
                this.loading = false;
            });
    }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService, MenuService } from './../_services/index';


@Component({
    templateUrl: './menu.component.html',
})

export class MenuComponent {
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
            name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
            price: [null, [Validators.required, Validators.min(1), Validators.max(1000), Validators.pattern('[0-9]*')]],
            available: formBuilder.group(
                this.availableOptions.reduce((prev, curr) => { prev[curr] = [false, []]; return prev; }, {})
            ),
            category: ['', Validators.maxLength(20)],
            subCategory: ['', Validators.maxLength(20)],
            tasteType: '',
            subTasteType: ''
        });
    }

    submit(values) {
        this.menuService.create(values)
            .subscribe(
            data => {
                this.router.navigate(['/admin/menus']);
            },
            err => {
                this.alertService.error(err);
            });
    }

}

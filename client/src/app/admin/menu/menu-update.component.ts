import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, MenuService } from './../_services/index';
 

@Component({
    templateUrl: './menu-update.component.html',
})

export class MenuUpdateComponent implements OnInit {
    menuForm : FormGroup;
    _id : string;
    loading : boolean = false;
    availableOptions = ['Morning', 'Noon', 'Evening', 'Night'];
    tasteTypeOptions = ['Spicy', 'Sweet', 'Salty', 'Sweet N Salty'];
    subTasteTypeOptions = ['Normal', 'Medium', 'High'];


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private menuService: MenuService,
        private alertService: AlertService,
        private formBuilder: FormBuilder){

            this.route.params.subscribe(params=>{
                this._id = params._id;
            })

            this.menuForm = formBuilder.group({
                name : [null, Validators.required],
                price : [null, Validators.required],
                available : formBuilder.group(
                    this.availableOptions.reduce((prev, curr)=>{prev[curr] = [false, []]; return prev;},{})
                ),
                category : '',
                subCategory : '',
                tasteType : '',
                subTasteType : '',
                active : true,
            })
        }

    ngOnInit() {
        this.menuService.getById(this._id)
        .subscribe(
            data => {
                this.menuForm.patchValue({
                    name : data.name,
                    price : data.price,
                    available : data.available,
                    category : data.category,
                    subCategory : data.subCategory,
                    tasteType : data.tasteType,
                    subTasteType : data.subTasteType,
                    active : data.active,
                });
            },
            error => {
                this.alertService.error(error);
            }
        )
    }
    
    update(value) {
        this.loading = true;
        value._id = this._id;
        this.menuService.update(value)
        .subscribe(
            data => {
                this.router.navigate(['/admin/menus']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        );
    }

}
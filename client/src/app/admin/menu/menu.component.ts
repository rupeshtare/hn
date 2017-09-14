import { Component } from '@angular/core';
import { NgForm as ngForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService, MenuService } from './../_services/index';
 

@Component({
    templateUrl: './menu.component.html',
})

export class MenuComponent {
    model: any = {}; 
    loading = false;
    availableOptions = ['Morning', 'Noon', 'Evening', 'Night'];
    availables = [];
    
    constructor(
        private router: Router,
        private menuService: MenuService,
        private alertService: AlertService){ 
            this.setAvailability();
        }

    setAvailability() {
        this.availables = this.availableOptions.map(
            option => ({name: option, value: option[0], checked:false})
        )
    }

    submit() {
        this.loading = true;
        this.menuService.create(this.model)
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

    updateAvailableOptions(option, event) {
        this.model.available
    }

}
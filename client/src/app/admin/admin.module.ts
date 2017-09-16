import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './index';
import { TableComponent, TableColumnSelectorComponent } from '../_directives/index';
import { CustomerComponent, CustomerListComponent, CustomerUpdateComponent } from './customer/index';
import { MenuComponent, MenuListComponent, MenuUpdateComponent } from './menu/index';
import { AdminRoutingModule } from "./admin-routing.module";
import { CustomerService, MenuService } from './_services/index';
import { SplitAndTitlePipe } from '../_pipes/index';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AdminRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [
        TableComponent,
        TableColumnSelectorComponent,
        SplitAndTitlePipe,
        AdminComponent,
        CustomerComponent,
        CustomerListComponent,
        CustomerUpdateComponent,
        MenuComponent,
        MenuListComponent,
        MenuUpdateComponent
    ],
    providers: [
        CustomerService,
        MenuService
    ]
})

export class AdminModule { }
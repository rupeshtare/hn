import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './index';
import { TableComponent, TableColumnSelectorComponent, PageHeaderComponent, TablePaginationComponent, PdfComponent } from '../_directives/index';
import { CustomerComponent, CustomerListComponent, CustomerUpdateComponent } from './customer/index';
import { MenuComponent, MenuListComponent, MenuUpdateComponent } from './menu/index';
import { AdminRoutingModule } from "./admin-routing.module";
import { CustomerService, MenuService, OrderService, UserService } from './_services/index';
import { SplitAndTitlePipe, FormatColumnPipe, ChainedAttributePipe } from '../_pipes/index';
import { OrderComponent, OrderListComponent } from './order/index';
import { CustomerBillingComponent, CompanyBillingComponent } from './billing/index';


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
        TablePaginationComponent,
        SplitAndTitlePipe,
        FormatColumnPipe,
        ChainedAttributePipe,
        PageHeaderComponent,
        AdminComponent,
        CustomerComponent,
        CustomerListComponent,
        CustomerUpdateComponent,
        MenuComponent,
        MenuListComponent,
        MenuUpdateComponent,
        OrderComponent,
        OrderListComponent,
        CustomerBillingComponent,
        CompanyBillingComponent,
        PdfComponent
    ],
    providers: [
        CustomerService,
        MenuService,
        OrderService,
        UserService
    ]
})

export class AdminModule { }
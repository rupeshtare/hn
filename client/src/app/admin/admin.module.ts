import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './index';
import {
    PermissionDirective, TableComponent, TableColumnSelectorComponent, PageHeaderComponent,
    TablePaginationComponent, TableColumnSortDirective, PdfComponent, TableFilterComponent
} from '../_directives/index';
import { CustomerComponent, CustomerListComponent, CustomerUpdateComponent } from './customer/index';
import { MenuComponent, MenuListComponent, MenuUpdateComponent } from './menu/index';
import { AdminRoutingModule } from './admin-routing.module';
import {
    CustomerService, MenuService, OrderService, UserService, CompanyService, MessService,
    DineService, TimeingService, TableService
} from './_services/index';
import { SplitAndTitlePipe, FormatColumnPipe, ChainedAttributePipe } from '../_pipes/index';
import { OrderComponent, OrderListComponent } from './order/index';
import { CustomerBillingComponent, CompanyBillingComponent } from './billing/index';
import { DatePickerModule } from 'angular-io-datepicker';
import { CompanyListComponent, CompanyComponent, CompanyUpdateComponent } from './company/index';
import { MessMemberListComponent, MessMemberComponent, MessMemberUpdateComponent } from './mess-member/index';
import { MessListComponent } from './mess/index';
import { TimeingComponent } from './timeing/index';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AdminRoutingModule,
        ReactiveFormsModule,
        DatePickerModule,
    ],
    declarations: [
        TableComponent,
        TableFilterComponent,
        TableColumnSelectorComponent,
        TablePaginationComponent,
        TableColumnSortDirective,
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
        PdfComponent,
        CompanyListComponent,
        CompanyComponent,
        CompanyUpdateComponent,
        MessMemberListComponent,
        MessMemberComponent,
        MessMemberUpdateComponent,
        MessListComponent,
        PermissionDirective,
        TimeingComponent
    ],
    providers: [
        TableService,
        CustomerService,
        MenuService,
        OrderService,
        UserService,
        CompanyService,
        MessService,
        DineService,
        TimeingService
    ]
})

export class AdminModule { }

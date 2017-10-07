import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './index';
import { CustomerComponent, CustomerListComponent, CustomerUpdateComponent } from './customer/index';
import { MenuComponent, MenuListComponent, MenuUpdateComponent } from './menu/index';
import { OrderComponent, OrderListComponent } from './order/index';
import { CustomerBillingComponent, CompanyBillingComponent } from './billing/index';
import { CompanyListComponent, CompanyComponent, CompanyUpdateComponent } from './company/index';
import { MessMemberListComponent, MessMemberComponent, MessMemberUpdateComponent } from './mess-member/index';
import { MessListComponent } from './mess/index';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminComponent,
                children: [
                    {
                        path: 'customers',
                        component: CustomerListComponent
                    },
                    {
                        path: 'customers/new',
                        component: CustomerComponent
                    },
                    {
                        path: 'customers/:_id',
                        component: CustomerUpdateComponent
                    },
                    {
                        path: 'menus',
                        component: MenuListComponent
                    },
                    {
                        path: 'menus/new',
                        component: MenuComponent
                    },
                    {
                        path: 'menus/:_id',
                        component: MenuUpdateComponent
                    },
                    {
                        path: 'orders',
                        component: OrderListComponent
                    },
                    {
                        path: 'orders/new',
                        component: OrderComponent
                    },
                    {
                        path: 'billings/customer',
                        component: CustomerBillingComponent
                    },
                    {
                        path: 'billings/company',
                        component: CompanyBillingComponent
                    },
                    {
                        path: 'companies',
                        component: CompanyListComponent
                    },
                    {
                        path: 'companies/new',
                        component: CompanyComponent
                    },
                    {
                        path: 'companies/:_id',
                        component: CompanyUpdateComponent
                    },
                    {
                        path: 'mess-members',
                        component: MessMemberListComponent
                    },
                    {
                        path: 'mess-members/new',
                        component: MessMemberComponent
                    },
                    {
                        path: 'mess-members/:_id',
                        component: MessMemberUpdateComponent
                    },
                    {
                        path: 'mess',
                        component: MessListComponent
                    },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class AdminRoutingModule { }
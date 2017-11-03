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
import { TimeingComponent } from './timeing/index';
import { AuthGuard } from './../_guards/index';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminComponent,
                canActivateChild: [AuthGuard],
                children: [
                    {
                        path: 'customers',
                        component: CustomerListComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['customer'] }
                    },
                    {
                        path: 'customers/new',
                        component: CustomerComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['customer'] }
                    },
                    {
                        path: 'customers/:_id',
                        component: CustomerUpdateComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['customer'] }
                    },
                    {
                        path: 'menus',
                        component: MenuListComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['menu'] }
                    },
                    {
                        path: 'menus/new',
                        component: MenuComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['menu'] }
                    },
                    {
                        path: 'menus/:_id',
                        component: MenuUpdateComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['menu'] }
                    },
                    {
                        path: 'orders',
                        component: OrderListComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['order'] }
                    },
                    {
                        path: 'orders/new',
                        component: OrderComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['order'] }
                    },
                    {
                        path: 'billings/customer',
                        component: CustomerBillingComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['billing'] }
                    },
                    {
                        path: 'billings/company',
                        component: CompanyBillingComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['billing'] }
                    },
                    {
                        path: 'companies',
                        component: CompanyListComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['company'] }
                    },
                    {
                        path: 'companies/new',
                        component: CompanyComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['company'] }
                    },
                    {
                        path: 'companies/:_id',
                        component: CompanyUpdateComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['company'] }
                    },
                    {
                        path: 'mess-members',
                        component: MessMemberListComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['mess-member'] }
                    },
                    {
                        path: 'mess-members/new',
                        component: MessMemberComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['mess-member'] }
                    },
                    {
                        path: 'mess-members/:_id',
                        component: MessMemberUpdateComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['mess-member'] }
                    },
                    {
                        path: 'mess',
                        component: MessListComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['mess'] }
                    },
                    {
                        path: 'timeing',
                        component: TimeingComponent,
                        canActivate: [AuthGuard],
                        data: { roles: ['admin'], permissions: ['timeing'] }
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

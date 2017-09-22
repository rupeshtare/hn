import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent }    from './index';
import { CustomerComponent, CustomerListComponent, CustomerUpdateComponent } from './customer/index';
import { MenuComponent, MenuListComponent, MenuUpdateComponent } from './menu/index';
import { OrderComponent, OrderListComponent } from './order/index';
import { BillingComponent } from './billing/index';


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
                        path: 'billings',
                        component: BillingComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class AdminRoutingModule { }
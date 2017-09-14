import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent }    from './index';
import { CustomerComponent, CustomerListComponent, CustomerUpdateComponent } from './customer/index';
import { MenuComponent, MenuListComponent, MenuUpdateComponent } from './menu/index';


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
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: HomeComponent
            },
            {
                path: 'login',
                component: LoginComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class HomeRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { HomeRoutingModule } from './home-routing.module';
import { AuthenticationService } from './_services/index';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HomeRoutingModule
    ],
    declarations: [
        HomeComponent,
        LoginComponent
    ],
    providers: [
        AuthenticationService
    ]
})

export class HomeModule { }

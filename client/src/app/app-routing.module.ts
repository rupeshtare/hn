import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/index';

const routes: Routes = [
    { path: '', loadChildren: 'app/home/home.module#HomeModule', },
    { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule', canActivate: [AuthGuard], data: { roles: ['admin', 'super-admin'] }},

    // otherwise redirect to home
    // { path: '**', redirectTo: '' }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
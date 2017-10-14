import { Injectable } from '@angular/core';
import { SessionStorageService, AlertService } from '../_services/index';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as _ from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private alertService: AlertService,
        private sessionStorageService: SessionStorageService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.sessionStorageService.get('currentUser');
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        // check user has correct role
        const userRole = currentUser.role ? currentUser.role : '';
        const roles = route && route.data['roles'] && route.data['roles'].length > 0 ? route.data['roles'] : [];
        const hasRole = roles.indexOf(userRole) !== -1;

        // check user has correct permission
        const userPermissions = currentUser.permissions ? currentUser.permissions : '';
        const permissions = route && route.data['permissions'] && route.data['permissions'].length > 0 ? route.data['permissions'] : null;
        const hnPermission = permissions === null ? true : _.some(_.map(userPermissions, (perm => permissions.indexOf(perm) > -1)));

        // logged in and has permissions so return true
        if (userRole === 'super-admin' || hnPermission && hasRole) {
            return true;
        } else {
            // logged in but has not permissions so redirect to login page
            this.alertService.error('You dont have permissions.');
            this.router.navigate(['/login']);
            return false;
        }
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }
}

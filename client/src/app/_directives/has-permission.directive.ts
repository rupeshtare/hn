import { Directive, OnInit, ElementRef, Input } from '@angular/core';
import { SessionStorageService } from '../_services/index';
import * as _ from 'lodash';

@Directive({
    selector: '[hnPermission]'
})

export class PermissionDirective implements OnInit {
    @Input() hnPermission: Array<string>;

    constructor(
        private _elem: ElementRef,
        private sessionStorageService: SessionStorageService) { }

    ngOnInit() {
        this.applyPermission();
    }

    applyPermission() {
        const currentUser = this.sessionStorageService.get('currentUser');
        const permissions = currentUser && currentUser.permissions && currentUser.permissions.length > 0 ? currentUser.permissions : [];
        const hnPermission = _.some(_.map(this.hnPermission, (perm => permissions.indexOf(perm) > -1)));

        const userRole = currentUser.role ? currentUser.role : '';

        if (userRole === 'super-admin' || hnPermission) {
            this._elem.nativeElement.style.display = '';
        } else {
            this._elem.nativeElement.style.display = 'none';
        }
    }

}

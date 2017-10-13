import { Directive, OnInit, ElementRef, Input } from '@angular/core';
import { SessionStorageService } from '../_services/index';
import * as _ from 'lodash';

@Directive({
    selector: '[hasPermission]'
})

export class HasPermissionDirective implements OnInit {
    @Input('hasPermission') permissions: Array<string>;

    constructor(
        private _elem: ElementRef,
        private sessionStorageService: SessionStorageService) { }

    ngOnInit() {
        this.applyPermission();
    }

    applyPermission() {
        let currentUser = this.sessionStorageService.get('currentUser');
        let permissions = currentUser && currentUser.permissions && currentUser.permissions.length > 0 ? currentUser.permissions : [];
        let hasPermission = _.some(_.map(this.permissions, (perm => { return permissions.indexOf(perm) > -1 })));

        let userRole = currentUser.role ? currentUser.role : '';

        if (userRole === 'super-admin' || hasPermission) {
            this._elem.nativeElement.style.display = '';
        }
        else {
            this._elem.nativeElement.style.display = 'none';
        }
    }

}
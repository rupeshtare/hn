import { Injectable } from '@angular/core';
import { SessionStorageService } from './../../_services/index';

@Injectable()
export class UserService {

    constructor(private sessionStorageService: SessionStorageService) { }

    logout(): void {
        // remove user from local storage to log user out
        this.sessionStorageService.remove('currentUser');
    }

    currentUser(): object {
        return this.sessionStorageService.get('currentUser');
    }
}

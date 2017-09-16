import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SessionStorageService } from './../../_services/index';
import 'rxjs/add/operator/map';
 
@Injectable()
export class AuthenticationService {
    constructor(
        private http: Http,
        private sessionStorageService: SessionStorageService) { }
 
    login(username: string, password: string) {
        return this.http.post('/users/authenticate', { username: username, password: password })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    this.sessionStorageService.set('currentUser', user);
                }
 
                return user;
            });
    }
 
    logout() {
        // remove user from local storage to log user out
        this.sessionStorageService.remove('currentUser');
    }
}
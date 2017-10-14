import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './_services/index';

@Component({
    templateUrl: './admin.component.html',
})

export class AdminComponent implements OnInit {
    public user: object = {};

    constructor(
        private router: Router,
        private userService: UserService) { }

    ngOnInit(): void {
        this.user = this.userService.currentUser();
    }

    logout(): void {
        this.userService.logout();
        this.router.navigate(['/login']);
    }
}

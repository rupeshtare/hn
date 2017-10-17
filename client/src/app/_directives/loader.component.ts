import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LoaderService } from '../_services/index';

@Component({
    moduleId: module.id,
    selector: 'hn-loader',
    templateUrl: 'loader.component.html'
})

export class LoaderComponent implements OnInit, OnDestroy {
    public loading: boolean;
    private subscription: Subscription;

    constructor(private loaderService: LoaderService) { }

    ngOnInit() {
        this.subscription = this.loaderService.getStatus().subscribe(data => { this.loading = data.status; });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

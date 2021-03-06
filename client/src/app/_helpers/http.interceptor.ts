import { Injectable } from '@angular/core';
import {
    ConnectionBackend, XHRBackend, RequestOptions, Request, RequestOptionsArgs,
    Response, Http, Headers, URLSearchParams
} from '@angular/http';
import { environment } from './../../environments/environment';
import { SessionStorageService, LoaderService } from '../_services/index';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class InterceptedHttp extends Http {
    constructor(
        backend: ConnectionBackend,
        defaultOptions: RequestOptions,
        private loaderService: LoaderService) {
        super(backend, defaultOptions);
    }

    get sessionStorageService() {
        return new SessionStorageService();
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, options).catch(this.handleError);
    }

    get(url: string, params?: object, options?: RequestOptionsArgs): Observable<Response> {
        this.onStart();
        if (params !== undefined) {
            const myParams = new URLSearchParams();
            Object.keys(params).forEach(key => { myParams.set(key, params[key]); });
            options = options || new RequestOptions();
            options.params = myParams;
        }
        url = this.updateUrl(url);
        return super.get(url, this.getRequestOptionArgs(options)).finally(() => { this.onEnd(); });
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        this.onStart();
        url = this.updateUrl(url);
        return super.post(url, body, this.getRequestOptionArgs(options)).finally(() => { this.onEnd(); });
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        this.onStart();
        url = this.updateUrl(url);
        return super.put(url, body, this.getRequestOptionArgs(options)).finally(() => { this.onEnd(); });
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        this.onStart();
        url = this.updateUrl(url);
        return super.delete(url, this.getRequestOptionArgs(options)).finally(() => { this.onEnd(); });
    }

    private updateUrl(req: string) {
        return environment.origin + req;
    }

    private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        options = options || new RequestOptions();
        options.headers = options.headers || new Headers();
        options.headers.append('Content-Type', 'application/json');

        // add authorization header with jwt token
        const currentUser = this.sessionStorageService.get('currentUser');
        if (currentUser && currentUser.token) {
            options.headers.append('Authorization', 'hn ' + currentUser.token);
        }

        return options;
    }

    private handleError(error: any) {
        if (error.status === 401) {
            // 401 unauthorized response so log user out of client
            window.location.href = '/login';
        }
        if (error.status === 0) {
            // 0 server is not reachable
            error._body = 'Server is not reachable. Please contact admin.';
        }
        return Observable.throw(error._body);
    }

    private onStart() {
        this.loaderService.show();
    }

    private onEnd() {
        this.loaderService.hide();
    }

}

export function customHttpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, loaderService: LoaderService): Http {
    return new InterceptedHttp(xhrBackend, requestOptions, loaderService);
}

export let customHttpProvider = {
    provide: Http,
    useFactory: customHttpFactory,
    deps: [XHRBackend, RequestOptions, LoaderService]
};

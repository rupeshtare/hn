import { Injectable } from "@angular/core";
import { ConnectionBackend, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from "@angular/http";
import { environment } from "./../../environments/environment";

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class InterceptedHttp extends Http {
    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, options).catch(this.handleError);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.get(url, this.getRequestOptionArgs(options));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.post(url, body, this.getRequestOptionArgs(options));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.put(url, body, this.getRequestOptionArgs(options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.delete(url, this.getRequestOptionArgs(options));
    }

    private updateUrl(req: string) {
        return  environment.origin + req;
    }

    private getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
        options = options || new RequestOptions();
        options.headers = options.headers || new Headers();
        options.headers.append('Content-Type', 'application/json');

        // add authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
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
}

export function customHttpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions): Http {
    return new InterceptedHttp(xhrBackend, requestOptions);
}

export let customHttpProvider = {
    provide: Http,
    useFactory: customHttpFactory,
    deps: [XHRBackend, RequestOptions]
};
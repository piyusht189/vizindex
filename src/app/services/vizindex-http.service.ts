import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

/* import { EssenviaError, EssenviaResponse } from '../models/essenvia-base.model' */
import * as RootReducer from "../app.reducers";
import { notifyService } from "../../services/snotify";

const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
    withCredentials: false
};

@Injectable()
export class VizIndexHttpService {
    public TIMEOUT = 30000;
    public baseUrl: string;

    constructor(public notify: notifyService, public router: Router, public http: HttpClient, public rootstore: Store<RootReducer.PState>) {
        this.baseUrl = '../../';
    }

    public httpGet(path: string, checkStatus?: boolean): Observable<any> {
        const url = path;
        return this.http.get(url, httpOptions).pipe(
            map(response => this.processResponse(response)),
            catchError(error => this.handleError(error))
        );
    }    
    

    protected processResponse(response): any {
        return { response: response };
    }
    protected handleError(error: HttpErrorResponse): Observable<any> {
        return of({ failed: true, response: error });
    }
}

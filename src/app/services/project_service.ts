import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as RootReducer from "../app.reducers";
import { VizIndexHttpService } from "./vizindex-http.service";

@Injectable()
export class ProjectService {
    user_id;
    email;
    customer_id
    constructor(
        public httpService: VizIndexHttpService,
        public rootstore: Store<RootReducer.PState>
    ) {
        
    }
    public getAllCovid(): Observable<any> {
        return this.httpService.httpGet("../../assets/data/n_covid_all.json").pipe(
            map(response => {
                return response;
            })
        );
    }

    public getAllIndustrial(): Observable<any> {
        return this.httpService.httpGet("../../assets/data/n_states.json").pipe(
            map(response => {
                return response;
            })
        );
    }
}

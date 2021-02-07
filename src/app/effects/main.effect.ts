import { NgxSpinnerService } from "ngx-spinner";
import { ProjectService } from "./../services/project_service";
import * as ProjectActions from "./../actions/project";
import { ProjectActionTypes } from "./../actions/project";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, mergeMap, switchMap } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as RootReducer from "../app.reducers";
import { take } from "rxjs/operators";
import { notifyService } from "../../services/snotify";

@Injectable()
export class MainEffects {
    

    
    @Effect()
    public getAllCovid$: Observable<Action> = this.actions$.pipe(
        ofType(ProjectActionTypes.GetCovidData),
        map((action: ProjectActions.GetCovidData) => action),
        switchMap(payload => {
            return this.projectService.getAllCovid();
        }),
        map(response => {
            //this.spinner.hide()
            if(response){
                if(response['response']){
                    if(response.response.length){
                        return new ProjectActions.GetCovidDataSuccess(response['response']);
                    }
                }
                
            }
            this.notify.onError("Error", "CORS issue or File Missing");
            return new ProjectActions.GetCovidDataFailed(response['response']);
        })
    );

    @Effect()
    public getAllCovidGraph$: Observable<Action> = this.actions$.pipe(
        ofType(ProjectActionTypes.GetCovidGraphData),
        map((action: ProjectActions.GetCovidGraphData) => action),
        switchMap(payload => {
            return this.projectService.getAllCovidGraph();
        }),
        map(response => {
            //this.spinner.hide()
            if(response){
                if(response['response']){
                    if(response.response.length){
                        return new ProjectActions.GetCovidGraphDataSuccess(response['response']);
                    }
                }
                
            }
            this.notify.onError("Error", "CORS issue or File Missing");
            return new ProjectActions.GetCovidGraphDataFailed(response['response']);
        })
    );


    @Effect()
    public getAllHeatmap$: Observable<Action> = this.actions$.pipe(
        ofType(ProjectActionTypes.GetHeatmapData),
        map((action: ProjectActions.GetHeatmapData) => action),
        switchMap(payload => {
            return this.projectService.getHeatmapData();
        }),
        map(response => {
            //this.spinner.hide()
            if(response){
                if(response['response']){
                        return new ProjectActions.GetHeatmapDataSuccess(response['response']);
                }
                
            }
            this.notify.onError("Error", "CORS issue or File Missing");
            return new ProjectActions.GetHeatmapDataFailed(response['response']);
        })
    );

    @Effect()
    public getAllIndustrial$: Observable<Action> = this.actions$.pipe(
        ofType(ProjectActionTypes.GetIndustriesData),
        map((action: ProjectActions.GetIndustriesData) => action),
        switchMap(payload => {
            return this.projectService.getAllIndustrial();
        }),
        map(response => {
                this.spinner.hide()
                if(response){
                    if(response['response']){
                        if(response.response.length){
                            return new ProjectActions.GetIndustriesDataSuccess(response['response']);
                        }
                    }
                    
                }
                    this.notify.onError("Error", "CORS issue or File Missing");
                    return new ProjectActions.GetIndustriesDataFailed(response['response']);
                
           
        })
    );

    constructor(
        public projectService: ProjectService,
        public actions$: Actions,
        private spinner: NgxSpinnerService,
        public rootstore: Store<RootReducer.PState>,
        public notify: notifyService
    ) {
        
    }
}

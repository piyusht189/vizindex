import { storeLogger } from "ngrx-store-logger";

import { environment } from "../environments/environment";
import { Action, ActionReducer, ActionReducerMap, createFeatureSelector, MetaReducer, combineReducers, createSelector } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';



import * as fromCovid from "./reducers/covid";
import * as fromCovidGraph from "./reducers/covid_graph";
import * as fromIndustrial from "./reducers/industrial";

export const FEATURE_NAME = '';
const STORE_KEYS_TO_PERSIST = [];

export interface PState {
    covid_data: any,
    industrial_data: any,
    covid_graph: any
}

export const appReducers: ActionReducerMap<PState> = {
    covid_data: fromCovid.reducer,
    industrial_data: fromIndustrial.reducer,
    covid_graph: fromCovidGraph.reducer
};
//export function loggerReducer(reducer: ActionReducer<State>): any {
    // default, no options
 //   return storeLogger()(reducer);
//}




//export function localStorageSyncReducer(reducer: ActionReducer<State>): ActionReducer<State> {
 //   return localStorageSync({
 //       keys: STORE_KEYS_TO_PERSIST,
 //       rehydrate: true,
 //   })(reducer);
//}



//export const metaReducers: Array<MetaReducer<State, Action>> = [localStorageSyncReducer];

export const getProjectDetailsState = createFeatureSelector<PState>("project_details");


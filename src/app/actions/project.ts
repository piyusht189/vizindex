import { Action } from "@ngrx/store";

export enum ProjectActionTypes {
    GetCovidData= "GET_COVID_DATA",
    GetCovidDataSuccess = "GET_COVID_DATA_SUCCESS",
    GetCovidDataFailed = "GET_COVID_DATA_FAILED",

    GetCovidGraphData= "GET_COVID_GRAPH_DATA",
    GetCovidGraphDataSuccess = "GET_COVID_GRAPH_DATA_SUCCESS",
    GetCovidGraphDataFailed = "GET_COVID_GRAPH_DATA_FAILED",

    GetIndustriesData= "GET_INDUSTRIES_DATA",
    GetIndustriesDataSuccess = "GET_INDUSTRIES_DATA_SUCCESS",
    GetIndustriesDataFailed = "GET_INDUSTRIES_DATA_FAILED",

    GetHeatmapData = "GET_HEATMAP_DATA",
    GetHeatmapDataSuccess = "GET_HEATMAP_DATA_SUCCESS",
    GetHeatmapDataFailed = "GET_HEATMAP_DATA_FAILED"

}


export class GetCovidData implements Action {
    readonly type = ProjectActionTypes.GetCovidData;
    constructor() { }
}
export class GetCovidDataSuccess implements Action {
    readonly type = ProjectActionTypes.GetCovidDataSuccess;
    constructor(public payload: any) { }
}
export class GetCovidDataFailed implements Action {
    readonly type = ProjectActionTypes.GetCovidDataFailed;
    constructor(public payload: any) { }
}


export class GetCovidGraphData implements Action {
    readonly type = ProjectActionTypes.GetCovidGraphData;
    constructor() { }
}
export class GetCovidGraphDataSuccess implements Action {
    readonly type = ProjectActionTypes.GetCovidGraphDataSuccess;
    constructor(public payload: any) { }
}
export class GetCovidGraphDataFailed implements Action {
    readonly type = ProjectActionTypes.GetCovidGraphDataFailed;
    constructor(public payload: any) { }
}

export class GetIndustriesData implements Action {
    readonly type = ProjectActionTypes.GetIndustriesData;
    constructor() { }
}
export class GetIndustriesDataSuccess implements Action {
    readonly type = ProjectActionTypes.GetIndustriesDataSuccess;
    constructor(public payload: any) { }
}
export class GetIndustriesDataFailed implements Action {
    readonly type = ProjectActionTypes.GetIndustriesDataFailed;
    constructor(public payload: any) { }
}

export class GetHeatmapData implements Action {
    readonly type = ProjectActionTypes.GetHeatmapData;
    constructor() { }
}
export class GetHeatmapDataSuccess implements Action {
    readonly type = ProjectActionTypes.GetHeatmapDataSuccess;
    constructor(public payload: any) { }
}
export class GetHeatmapDataFailed implements Action {
    readonly type = ProjectActionTypes.GetHeatmapDataFailed;
    constructor(public payload: any) { }
}





export type ProjectActions =
    | GetCovidData
    | GetCovidDataSuccess
    | GetCovidDataFailed
    | GetIndustriesData
    | GetIndustriesDataSuccess
    | GetIndustriesDataFailed
    | GetCovidGraphData
    | GetCovidGraphDataSuccess
    | GetCovidGraphDataFailed
    | GetHeatmapData
    | GetHeatmapDataSuccess
    | GetHeatmapDataFailed
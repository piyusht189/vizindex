import { ProjectActions, ProjectActionTypes } from "./../actions/project";
const initialState = [];

export function reducer(state = initialState, action: ProjectActions): any {
    switch (action.type) {
        case ProjectActionTypes.GetHeatmapDataSuccess:
            return action["payload"];
        default:
            return state;
    }
}

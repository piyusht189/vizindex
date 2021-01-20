import { ProjectActions, ProjectActionTypes } from "./../actions/project";
const initialState = [];

export function reducer(state = initialState, action: ProjectActions): any {
    switch (action.type) {
        case ProjectActionTypes.GetCovidDataSuccess:
            return action["payload"];
        default:
            return state;
    }
}
import { ProjectActions, ProjectActionTypes } from "./../actions/project";
const initialState = [];

export function reducer(state = initialState, action: ProjectActions): any {
    switch (action.type) {
        case ProjectActionTypes.GetCovidGraphDataSuccess:
            return action["payload"];
        default:
            return state;
    }
}

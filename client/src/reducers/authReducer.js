// import { TEST_DISPATH } from "../actions/types";

const initialState = {
    isAuthenticated: false,
    user: {}
};

export default (state = initialState, action) => {
    switch(action.type) {
        default:
            return state;
    }
}
const initialState = {
    isAuthenticated: false,
    users: {}
};

export default (state = initialState, action) => {
    switch(action.type) {
        default:
            return state;
    }
}
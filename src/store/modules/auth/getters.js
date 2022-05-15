export default {
    email(state) {
        return state.email;
    },
    token(state) {
        return state.token;
    },
    isAuthenticated(state) {
        return !!state.token;
    }
};
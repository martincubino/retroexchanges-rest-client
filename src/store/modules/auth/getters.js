export default {
    email(state) {
        return state.email;
    },
    isAdmin(state){
        return state.isAdmin;
    },
    token(state) {
        return state.token;
    },
    isAuthenticated(state) {
        return !!state.token;
    }
};
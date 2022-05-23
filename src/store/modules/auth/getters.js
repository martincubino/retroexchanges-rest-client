export default {
    email(state) {
        state.email = JSON.parse(localStorage.getItem('auth')).email;
        return state.email;
    },
    isAdmin(state){
        state.isAdmin = JSON.parse(localStorage.getItem('auth')).isAdmin;
        return state.isAdmin;
    },
    token(state) {
        state.token = JSON.parse(localStorage.getItem('auth')).token;
        return state.token;
    },
    isAuthenticated(state) {
        state.token = JSON.parse(localStorage.getItem('auth')).token;
        return !!state.token;
    },
    tokenExpirateAt(state){
        state.tokenExpirateAt = JSON.parse(localStorage.getItem('auth')).tokenExpirateAt;
        return state.tokenExpirateAt;
    },
    tokenCreateAt(state){
        state.tokenCreateAt = JSON.parse(localStorage.getItem('auth')).tokenCreateAt;
        return state.tokenCreateAt;
    }
};
export default {
  setUser(state, payload) {
    state.token = payload.token;
    state.email = payload.email;
    state.tokenExpiration = payload.expirateAt;
    state.tokenCreation = payload.createAt;
  }
};
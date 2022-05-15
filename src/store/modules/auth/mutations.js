export default {
  setAuth(state, payload) {
    state.token = payload.token;
    state.email = payload.email;
    state.tokenCreateAt = payload.createAt;
    state.tokenExpirateAt = payload.expirateAt;
  }
};


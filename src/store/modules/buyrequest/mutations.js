export default {
  setBuyRequest(state, payload) {
    state.buyrequest = payload;
  },
  setBuyRequestsInbox(state, payload) {
    state.buyrequestsInbox = payload;
  },
  setBuyRequestsOutbox(state, payload) {
    state.buyrequestsOutbox = payload;
  },
  setFetchTimestamp(state) {
    state.lastFetch = new Date().getTime();
  }
};
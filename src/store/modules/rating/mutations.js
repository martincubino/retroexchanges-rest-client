export default {
  setRating(state, payload) {
    state.rating = payload;
  },
  setRatingsSent(state, payload) {
    state.ratingsSent = payload;
  },
  setRatingsReceived(state, payload) {
    state.ratingsReceived = payload;
  },
  setFetchTimestamp(state) {
    state.lastFetch = new Date().getTime();
  }
};
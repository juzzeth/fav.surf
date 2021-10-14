export const addBookmark = (state, payload) => {
  state.bookmarks.push(payload);
};

export const setBookmarks = (state, payload) => {
  state.bookmarks = payload;
};

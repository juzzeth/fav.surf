export const addBookmark = (state, payload) => {
  state.bookmarks.push(payload);
};

export const updateBookmarks = (state, payload) => {
  state.bookmarks = payload;
};

export const updateBookmark = (state, payload) => {
  state.bookmarks[payload.index] = payload.bookmark;
};

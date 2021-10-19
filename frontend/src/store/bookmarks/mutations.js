export const addBookmark = (state, payload) => {
  state.bookmarks.push(payload);
};

export const updateBookmarks = (state, payload) => {
  state.bookmarks = payload;
};

export const updateBookmark = (state, payload) => {
  state.bookmarks[payload.index] = payload.bookmark;
};

export const deleteBookmark = (state, payload) => {
  state.bookmarks.splice(payload.index, 1);
};

export const updateBookmarkFolder = (state, payload) => {
  state.bookmarks[payload.index].folder_id = payload.folder_id;
};

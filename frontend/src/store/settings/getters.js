export function bookmarks(state) {
  return state.bookmarks;
}

export function cardSize(state) {
  return state.cardSize;
}

export function views(state) {
  return state.views;
}

export function activeView(state) {
  return state.views.filter((view) => view.enabled)[0];
}

export function userDetails(state) {
  return state.userDetails;
}

export function loadingLogin(state) {
  return state.loadingLogin;
}

export const setUserDetails = (state, payload) => {
  state.userDetails = payload;
};

export const setCardSize = (state, value) => {
  state.cardSize = value;
};

export const toggleLoadingLogin = (state, value) => {
  state.loadingLogin = value;
};

export const updateView = (state, value) => {
  state.views.find((view) => view.enabled).enabled = false;
  state.views.find((view) => view.id == value).enabled = true;
};

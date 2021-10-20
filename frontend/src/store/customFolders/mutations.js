export const updateFolders = (state, payload) => {
  state.folders = payload;
};

export const setDragHoveredFolder = (state, payload) => {
  state.dragHovered = payload;
};

export const setDrag = (state, payload) => {
  state.drag = payload;
};

export const addFolder = (state, payload) => {
  state.folders = [...state.folders, payload];
};

export const deleteFolder = (state, payload) => {
  state.folders.splice(payload, 1);
};

export const renameFolder = (state, payload) => {
  state.folders[payload.index].name = payload.name;
};

export const updateFolder = (state, payload) => {
  let index = state.folders.findIndex((f) => f.id === payload.id);
  state.folders[index] = payload;
};

export const changeIcon = (state, payload) => {
  state.folders[payload.index].icon = payload.icon;
  state.folders[payload.index].icon_color = payload.icon_color;
};

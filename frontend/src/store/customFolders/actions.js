export function deleteFolder({ commit }, payload) {
  commit("deleteFolder", payload);
}

export function updateFolders({ commit }, payload) {
  commit("updateFolders", payload);
}

export function renameFolder({ commit }, payload) {
  commit("renameFolder", payload);
}

export function addFolder({ commit }, payload) {
  commit("addFolder", payload);
}

export function changeIcon({ commit }, payload) {
  commit("changeIcon", payload);
}

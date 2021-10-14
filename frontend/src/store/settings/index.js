import state from "./state";
import * as getters from "./getters";
import * as mutations from "./mutations";
import { supabase } from "../../boot/supabase";

const actions = {
  setCardSize({ commit }, value) {
    commit("setCardSize", value);
  },

  updateView({ commit }, id) {
    commit("updateView", id);
  },

  setLoadingLogin({ commit }, payload) {
    commit("toggleLoadingLogin", payload);
  },

  setUserDetails({ commit }, payload) {
    commit("setUserDetails", payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

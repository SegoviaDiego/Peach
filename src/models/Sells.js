import { loadSells } from "../backendish/Src/Sell";
import { sells as types } from "../vuexTypes";

export default {
  state: {
    date: new Date(),
    data: [],
    loading: false,
    showSpinner: false,
    filter: ""
  },
  actions: {
    async [types.load]({ commit, state }) {
      commit(types.startLoading);
      setTimeout(() => {
        commit(types.showSpinner);
      }, 200);
      commit(types.load, await loadSells(state.date));
      commit(types.stopLoading);
      commit(types.hideSpinner);
    },
    [types.setDate]({ commit }, newDate) {
      commit(types.setDate, newDate);
    }
  },
  mutations: {
    [types.load](state, payload) {
      state.data = payload;
    },
    [types.startLoading](state) {
      state.loading = true;
    },
    [types.stopLoading](state) {
      state.loading = false;
    },
    [types.showSpinner](state) {
      if (state.loading) {
        state.showSpinner = true;
      }
    },
    [types.hideSpinner](state) {
      state.showSpinner = false;
    },
    [types.filter](state, value) {
      state.filter = value;
    },
    [types.setDate](state, value) {
      state.date = value;
    }
  }
};

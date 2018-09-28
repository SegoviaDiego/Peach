import { load } from "../backendish/Src/Total";
import { totals as types } from "../vuexTypes";

export default {
  state: {
    data: undefined,
    loading: false,
    filter: "",
    date: new Date(),
    cierreIndex: types.totalIndex
  },
  actions: {
    async [types.load]({ commit, state }) {
      commit(types.startLoading);
      commit(types.load, await load(state.date));
      commit(types.stopLoading);
    },
    [types.setDate]({ commit }, newDate) {
      commit(types.setDate, newDate);
    },
    [types.setCierreIndex]({ commit }, index) {
      commit(types.setCierreIndex, index);
    },
    [types.filter]({ commit }, value) {
      commit(types.filter, value);
    }
  },
  mutations: {
    [types.load](state, payload) {
      state.data = payload;
      if (state.data.cierres.length > state.cierreIndex)
        cierreIndex: types.totalIndex;
    },
    [types.startLoading](state) {
      state.loading = true;
    },
    [types.stopLoading](state) {
      state.loading = false;
    },
    [types.filter](state, value) {
      state.filter = value;
    },
    [types.setDate](state, value) {
      state.date = value;
    },
    [types.setCierreIndex](state, value) {
      state.cierreIndex = value;
    }
  }
};

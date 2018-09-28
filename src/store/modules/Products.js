import {
  loadProducts,
  createProduct,
  deleteItems,
  inStock,
  outStock,
  syncToSystel
} from "../backendish/Src/Product";
import { products as types } from "../vuexTypes";

export default {
  state: {
    data: [],
    inputs: {},
    loading: false,
    buttonRoute: 1,
    selected: {},
    filter: "",
    type: 1
  },
  actions: {
    async [types.load]({ commit }) {
      commit(types.startLoading);
      commit(types.load, []);
      commit(types.load, await loadProducts());
      commit(types.stopLoading);
    },
    async [types.syncToSystel]({ commit }) {
      commit(types.startLoading);
      await syncToSystel();
      // commit(types.load, await loadProducts());
    },
    async [types.create]({ commit }, product) {
      commit(types.startLoading);
      await createProduct(product);
      commit(types.load, await loadProducts());
      commit(types.stopLoading);
    },
    async [types.delete]({ commit }, selected) {
      commit(types.startLoading);
      await deleteItems(selected);
      commit(types.load, await loadProducts());
      commit(types.stopLoading);
    },
    async [types.inStock]({ commit }, amount) {
      commit(types.startLoading);
      await inStock(amount);
      commit(types.load, await loadProducts());
      commit(types.stopLoading);
    },
    async [types.outStock]({ commit }, payload) {
      commit(types.startLoading);
      await outStock(payload);
      commit(types.load, await loadProducts());
      commit(types.stopLoading);
    },
    [types.startRealTime]({ commit }) {
      startRealTimeProducts(async () => {
        commit(types.startLoading);
        commit(types.load, await loadProducts());
        commit(types.stopLoading);
      });
    },
    [types.filter]({ commit }, value) {
      commit(types.filter, value);
    },
    [types.stopRealTime]() {
      stopRealTimeProducts();
    },
    [types.buttons]({ commit }, route) {
      commit(types.buttons, route);
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
    [types.buttons](state, route) {
      state.buttonRoute = route;
    },
    [types.filter](state, value) {
      state.filter = value;
    }
  }
};

import Product from "@/Server/mongodb/Product";
import { products as types } from "@/vuexTypes";

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
    async [types.load]({ commit }: any) {
      commit(types.startLoading);
      commit(types.load, await Product.loadProducts());
      commit(types.stopLoading);
    },
    async [types.syncToSystel]({ commit }: any) {
      commit(types.startLoading);
      await Product.syncToSystel();
      commit(types.load, await Product.loadProducts());
    },
    async [types.create]({ commit }: any, product: any) {
      commit(types.startLoading);
      await Product.createProduct(product);
      commit(types.load, await Product.loadProducts());
      commit(types.stopLoading);
    },
    async [types.delete]({ commit }: any, selected: any) {
      commit(types.startLoading);
      await Product.deleteItems(selected);
      commit(types.load, await Product.loadProducts());
      commit(types.stopLoading);
    },
    async [types.inStock]({ commit }: any, payload: any) {
      commit(types.startLoading);
      await Product.inStock(payload.amount, payload.magnitude);
      commit(types.load, await Product.loadProducts());
      commit(types.stopLoading);
    },
    async [types.outStock]({ commit }: any, payload: any) {
      commit(types.startLoading);
      await Product.outStock(payload, payload.magnitude);
      commit(types.load, await Product.loadProducts());
      commit(types.stopLoading);
    },
    [types.filter]({ commit }: any, value: any) {
      commit(types.filter, value);
    },
    [types.buttons]({ commit }: any, route: any) {
      commit(types.buttons, route);
    },
    [types.startRealTime]({ commit }: any) {
      // startRealTimeProducts(async () => {
      //   commit(types.startLoading);
      //   commit(types.load, await loadProducts());
      //   commit(types.stopLoading);
      // });
    },
    [types.stopRealTime]() {
      // stopRealTimeProducts();
    }
  },
  mutations: {
    [types.load](state: any, payload: any) {
      state.data = payload;
    },
    [types.startLoading](state: any) {
      state.loading = true;
    },
    [types.stopLoading](state: any) {
      state.loading = false;
    },
    [types.buttons](state: any, route: any) {
      state.buttonRoute = route;
    },
    [types.filter](state: any, value: any) {
      state.filter = value;
    }
  }
};

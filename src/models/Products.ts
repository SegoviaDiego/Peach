import _ from "lodash";
import Client from "@/api/Client/Client";
import socketEvents from "@/socketEvents";
import { products as types } from "@/vuexTypes";

export default {
  state: {
    data: [],
    inputs: {},
    loading: false,
    buttonRoute: 1,
    newItem: {},
    selected: {},
    filter: "",
    type: 1
  },
  actions: {
    async [types.load]({ commit }: any) {
      commit(types.startLoading);
      commit(types.load, await Client.get(socketEvents.Product.loadProducts));
      commit(types.stopLoading);
    },
    async [types.syncToSystel]({ commit }: any) {
      commit(types.startLoading);
      await Client.set(socketEvents.Product.syncToSystel);
      commit(types.load, await Client.get(socketEvents.Product.loadProducts));
      commit(types.stopLoading);
    },
    [types.handleChange]({ commit }: any, payload: any) {
      if (payload.input == 0) {
        commit(types.removeFromInputs, payload.item._id);
      } else if (payload.input) {
        commit(types.handleChange, payload);
      }
    },
    [types.removeFromInputs]({ commit }: any, id: any) {
      commit(types.removeFromInputs, id);
    },
    [types.clearInputs]({ commit }: any) {
      commit(types.clearInputs);
    },
    async [types.create]({ dispatch, commit }: any, product: any) {
      commit(types.startLoading);
      await Client.set(socketEvents.Product.createProduct, product);
      dispatch(types.load);
      commit(types.stopLoading);
    },
    async [types.modify]({ commit }: any, mutated: any) {
      await commit(types.startLoading);
      await Client.set(socketEvents.Product.mutateProducts, mutated);
      await commit(
        types.load,
        await Client.get(socketEvents.Product.loadProducts)
      );
      await commit(types.stopLoading);
    },
    async [types.compose]({ dispatch, commit }: any, payload: any) {
      commit(types.startLoading);
      await Client.set(socketEvents.Product.composeProduct, payload);
      await dispatch(types.load);
      commit(types.stopLoading);
    },
    async [types.delete]({ commit }: any, selection: any) {
      commit(types.startLoading);
      await Client.set(socketEvents.Product.deleteProducts, selection);
      commit(types.load, await Client.get(socketEvents.Product.loadProducts));
      commit(types.stopLoading);
    },
    async [types.inStock]({ commit, state }: any) {
      commit(types.startLoading);
      await Client.set(socketEvents.Product.inStock, state.inputs);
      commit(types.load, await Client.get(socketEvents.Product.loadProducts));
      commit(types.stopLoading);
    },
    async [types.outStock]({ commit, state }: any, type: any) {
      commit(types.startLoading);
      await Client.set(socketEvents.Product.outStock, {
        outs: state.inputs,
        type
      });
      commit(types.load, await Client.get(socketEvents.Product.loadProducts));
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
    [types.handleChange](state: any, payload: any) {
      let d = { ...state.inputs };
      d[payload.item._id] = payload;
      state.inputs = { ...d };
    },
    [types.removeFromInputs](state: any, id: any) {
      state.inputs = _.pickBy(state.inputs, item => {
        return item.item._id != id;
      });
    },
    [types.clearInputs](state: any) {
      state.inputs = {};
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

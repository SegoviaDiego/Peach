import _ from "lodash";
import Client from "@/api/Client/Client";
import { sell as types, products as pTypes } from "@/vuexTypes";
import socketEvents from "@/socketEvents";

export default {
  state: {
    sells: {},
    data: {},
    loading: false
  },
  actions: {
    async [types.load]({ commit }: any, date: Date) {
      commit(types.startLoading);
      // Sell.load(date)
      commit(types.load, await Client.get(socketEvents.Sell.load, date));
      commit(types.stopLoading);
    },
    async [types.saveSell]({ dispatch, commit, state }: any, payload: any) {
      commit(types.startLoading);
      Client.set(socketEvents.Sell.saveSell, { sells: state.data, payload });
      await commit(types.clearSells);
      await dispatch(pTypes.load);
      commit(types.stopLoading);
    },
    [types.handleChange]({ commit }: any, payload: any) {
      if (payload.amount == 0) {
        commit(types.removeFromSell, payload.item._id);
      } else if (payload.amount) {
        commit(types.handleChange, payload);
      }
    },
    [types.removeFromSell]({ commit }: any, id: any) {
      commit(types.removeFromSell, id);
    },
    [types.clearSells]({ commit }: any) {
      commit(types.clearSells);
    }
  },
  mutations: {
    [types.load](state: any, payload: any) {
      state.sells = payload;
    },
    [types.startLoading](state: any) {
      state.loading = true;
    },
    [types.stopLoading](state: any) {
      state.loading = false;
    },
    [types.handleChange](state: any, payload: any) {
      let d = { ...state.data };
      d[payload.item._id] = payload;
      state.data = { ...d };
    },
    [types.removeFromSell](state: any, id: any) {
      state.data = _.pickBy(state.data, item => {
        return item.item._id != id;
      });
    },
    [types.clearSells](state: any) {
      state.data = {};
    }
  }
};

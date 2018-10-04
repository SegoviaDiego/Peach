import _ from "lodash";
import Sell from "@/Server/mongodb/Sell";
import { sell as types, products as pTypes } from "@/vuexTypes";

export default {
  state: {
    data: {},
    loading: false
  },
  actions: {
    async [types.saveSell]({ dispatch, commit, state }: any, payload: any) {
      commit(types.startLoading);
      await Sell.save(state.data, payload);
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

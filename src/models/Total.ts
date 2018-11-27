import Client from "@/api/Client/Client";
import { totals as types } from "@/vuexTypes";
import socketEvents from "@/socketEvents";

export default {
  state: {
    data: undefined,
    exists: false,
    loading: false,
    filter: "",
    date: null,
    cierreIndex: types.totalIndex
  },
  actions: {
    async [types.load]({ commit, dispatch, state }: any) {
      commit(types.startLoading);
      // await Total.load(state.date)
      commit(types.load, await Client.get(socketEvents.Total.load, state.date));
      dispatch(types.setCierreIndex, types.totalIndex);
      commit(types.stopLoading);
    },
    [types.setDate]({ commit }: any, newDate: any) {
      commit(types.setDate, newDate);
    },
    [types.setCierreIndex]({ commit }: any, index: any) {
      commit(types.setCierreIndex, index);
    },
    [types.filter]({ commit }: any, value: any) {
      commit(types.filter, value);
    }
  },
  mutations: {
    [types.load](state: any, payload: any) {
      state.data = payload;
      if (payload) {
        state.exists = true;
        if (state.data.cierres.length > state.cierreIndex)
          cierreIndex: types.totalIndex;
      } else state.exists = false;
    },
    [types.startLoading](state: any) {
      state.loading = true;
    },
    [types.stopLoading](state: any) {
      state.loading = false;
    },
    [types.filter](state: any, value: any) {
      state.filter = value;
    },
    [types.setDate](state: any, value: any) {
      state.date = value;
    },
    [types.setCierreIndex](state: any, value: any) {
      state.cierreIndex = value;
    }
  }
};

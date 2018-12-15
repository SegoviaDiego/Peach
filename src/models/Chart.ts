import Client from "@/api/Client/Client";
import { chart as types } from "@/vuexTypes";
import socketEvents from "@/socketEvents";

export default {
  state: {
    loading: false,
    filter: null,
    start: new Date(),
    end: new Date(),
    dailySell: [],
    monthlySell: [],
    topProducts: []
  },
  actions: {
    async [types.loadDailySell]({ commit, state }: any, payload: any) {
      commit(types.startLoading);

      payload = payload || {};

      commit(
        types.loadDailySell,
        await Client.get(socketEvents.Chart.dailySell, {
          start: payload.start || state.start,
          end: payload.end || state.end
        })
      );

      commit(types.stopLoading);
    },
    async [types.loadMonthlySell]({ commit, state }: any, payload: any) {
      commit(types.startLoading);

      payload = payload || {};

      commit(
        types.loadMonthlySell,
        await Client.get(socketEvents.Chart.monthlySell, {
          start: payload.start || state.start,
          end: payload.end || state.end
        })
      );

      commit(types.stopLoading);
    },
    async [types.loadTopProducts]({ commit, state }: any, payload: any) {
      commit(types.startLoading);

      payload = payload || {};

      commit(
        types.loadTopProducts,
        await Client.get(socketEvents.Chart.topProducts, {
          start: payload.start || state.start,
          end: payload.end || state.end
        })
      );

      commit(types.stopLoading);
    },
    [types.setDate]({ commit }: any, payload: any) {
      commit(types.setDate, payload);
    },
    [types.filter]({ commit }: any, value: any) {
      commit(types.filter, value);
    }
  },
  mutations: {
    [types.loadDailySell](state: any, payload: any) {
      state.dailySell = payload;
    },
    [types.loadMonthlySell](state: any, payload: any) {
      state.monthlySell = payload;
    },
    [types.loadTopProducts](state: any, payload: any) {
      state.topProducts = payload;
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
    [types.setDate](state: any, payload: any) {
      state.start = payload.start;
      state.end = payload.end;
    }
  }
};

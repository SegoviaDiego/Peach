import Log from "@/Server/mongodb/Log";
import { log as types } from "@/vuexTypes";

export default {
  state: {
    ingreso: [],
    egreso: [],
    loading: false,
    filter: "",
    date: new Date(),
    type: 4
  },
  actions: {
    async [types.loadIngreso]({ commit, state }: any) {
      commit(types.startLoading);
      commit(
        types.loadIngreso,
        await Log.getLog(types.loadIngreso, state.date)
      );
      commit(types.stopLoading);
    },
    async [types.loadEgreso]({ commit, state }: any) {
      commit(types.startLoading);
      commit(
        types.loadEgreso,
        await Log.getLog(types.loadEgreso, state.date, state.type)
      );
      commit(types.stopLoading);
    },
    [types.setDate]({ commit }: any, newDate: any) {
      commit(types.setDate, newDate);
    },
    [types.setType]({ commit }: any, type: any) {
      commit(types.setType, type);
    },
    [types.filter]({ commit }: any, value: any) {
      commit(types.filter, value);
    }
  },
  mutations: {
    [types.loadIngreso](state: any, payload: any) {
      state.ingreso = payload;
    },
    [types.loadEgreso](state: any, payload: any) {
      state.egreso = payload;
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
    [types.setType](state: any, value: any) {
      state.type = value;
    }
  }
};

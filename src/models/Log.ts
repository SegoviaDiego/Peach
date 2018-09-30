import Log from "@/Server/mongodb/Log";
import { log as types } from "@/vuexTypes";

export default {
  state: {
    ingreso: [],
    egreso: [],
    mov: [],
    loading: false,
    filter: "",
    date: new Date(),
    type: 4
  },
  actions: {
    async [types.loadMov]({ commit, state }: any) {
      commit(types.startLoading);
      commit(
        types.loadMov,
        await Log.getLog(types.loadMov, state.date, state.type)
      );
      commit(types.stopLoading);
    },
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
    async [types.createMov]({ commit, state }: any, mov: any) {
      commit(types.startLoading);
      await Log.save(types.createMov, mov);
      commit(
        types.loadMov,
        await Log.getLog(types.loadMov, state.date, state.type)
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
    [types.loadMov](state: any, payload: any) {
      state.mov = payload;
    },
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

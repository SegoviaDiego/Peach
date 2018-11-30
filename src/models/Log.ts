import Client from "@/api/Client/Client";
import { log as types } from "@/vuexTypes";
import socketEvents from "@/socketEvents";

export default {
  state: {
    ingreso: [],
    egreso: [],
    mov: [],
    loading: false,
    filter: "",
    date: null,
    type: 4
  },
  actions: {
    async [types.loadMov]({ commit, state }: any) {
      commit(types.startLoading);
      commit(
        types.loadMov,
        await Client.get(socketEvents.Log.getLog, {
          db: types.loadMov,
          date: state.date,
          type: state.type
        })
      );
      commit(types.stopLoading);
    },
    async [types.loadIngreso]({ commit, state }: any) {
      commit(types.startLoading);
      commit(
        types.loadIngreso,
        await Client.get(socketEvents.Log.getLog, {
          db: types.loadIngreso,
          date: state.date
        })
      );
      commit(types.stopLoading);
    },
    async [types.loadEgreso]({ commit, state }: any) {
      commit(types.startLoading);
      commit(
        types.loadEgreso,
        await Client.get(socketEvents.Log.getLog, {
          db: types.loadEgreso,
          date: state.date,
          type: state.type
        })
      );
      commit(types.stopLoading);
    },
    async [types.createMov]({ dispatch, commit }: any, mov: any) {
      commit(types.startLoading);
      await Client.set(socketEvents.Log.saveLog, {
        type: types.createMov,
        payload: mov
      });
      await dispatch(types.loadMov);
      commit(types.stopLoading);
    },
    async [types.mutateMov]({ dispatch, commit }: any, mov: any) {
      commit(types.startLoading);
      await Client.set(socketEvents.Log.mutateMov, {
        payload: mov
      });
      await dispatch(types.loadMov);
      commit(types.stopLoading);
    },
    async [types.deleteMov]({ dispatch, commit }: any, id: any) {
      commit(types.startLoading);
      await Client.set(socketEvents.Log.deleteMov, {
        payload: id
      });
      await dispatch(types.loadMov);
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

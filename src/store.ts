import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import Product from "@/models/Products";
import Total from "@/models/Total";
import Log from "@/models/Log";

export default new Vuex.Store({
  modules: {
    Product,
    Total,
    Log
  }
});

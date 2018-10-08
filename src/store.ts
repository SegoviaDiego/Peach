import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import Product from "@/models/Products";
import Total from "@/models/Total";
import Log from "@/models/Log";
import Sell from "@/models/Sell";
import Settings from "@/models/Settings";

export default new Vuex.Store({
  modules: {
    Product,
    Total,
    Log,
    Sell,
    Settings
  }
});

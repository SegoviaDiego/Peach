import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// dependencies

import "typeface-lato/index.css";
import "typeface-pacifico/index.css";

import "./plugins/element.js";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faBoxOpen,
  faCalendarCheck,
  faEllipsisH,
  faTrashAlt,
  faPen,
  faPlus,
  faChevronLeft,
  faTimes,
  faSave,
  faSearch,
  faPrint,
  faWindowMinimize,
  faChevronCircleDown,
  faCog,
  faSlidersH,
  faDollarSign,
  faChartLine,
  faUsers,
  faDatabase,
  faServer,
  faSortUp,
  faSortDown,
  faCartPlus,
  faCartArrowDown,
  faExchangeAlt,
  faHdd,
  faToolbox,
  faHandHoldingUsd,
  faPuzzlePiece,
  faMoneyBillAlt,
  faChartPie
} from "@fortawesome/free-solid-svg-icons";

//Font awesome
library.add(
  faBoxOpen,
  faCalendarCheck,
  faEllipsisH,
  faTrashAlt,
  faPen,
  faPlus,
  faChevronLeft,
  faTimes,
  faSave,
  faSearch,
  faPrint,
  faCog,
  faWindowMinimize,
  faChevronCircleDown,
  faSlidersH,
  faDollarSign,
  faChartLine,
  faUsers,
  faDatabase,
  faServer,
  faSortUp,
  faSortDown,
  faCartPlus,
  faCartArrowDown,
  faExchangeAlt,
  faHdd,
  faToolbox,
  faHandHoldingUsd,
  faPuzzlePiece,
  faMoneyBillAlt,
  faChartPie
);

// dependencies

// Binding
Vue.component("fontawesome", FontAwesomeIcon);

// Binding

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

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
  faSignature,
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
  faWindowMinimize
} from "@fortawesome/free-solid-svg-icons";

//Font awesome
library.add(
  faBoxOpen,
  faSignature,
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
  faWindowMinimize
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

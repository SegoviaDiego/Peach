import Vue from "vue";
import Router from "vue-router";
import Frame from "@/components/Frame/index.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "frame",
      component: Frame,
      children: [
        // {
        //   path: "/stock",
        //   name: "stock",
        //   component: require("@/components/Stock/index").default
        // }
      ]
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});

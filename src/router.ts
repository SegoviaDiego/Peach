import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/app",
      name: "Frame",
      component: () =>
        import(/* webpackChunkName: "Frame" */ "@/components/Frame/index.vue"),
      children: [
        {
          path: "/dashboard",
          name: "Dashboard",
          component: () =>
            import(/* webpackChunkName: "Dashboard" */ "@/components/Dashboard/index.vue")
        },
        {
          path: "/Updater",
          name: "Updater",
          component: () =>
            import(/* webpackChunkName: "Updater" */ "@/components/Updater/index.vue")
        },
        {
          path: "/settings",
          name: "Settings",
          component: () =>
            import(/* webpackChunkName: "Settings" */ "@/components/Settings/index.vue")
        },
        {
          path: "/preferences",
          name: "Preferences",
          component: () =>
            import(/* webpackChunkName: "Preferences" */ "@/components/Settings/Preferences/index.vue")
        },
        {
          path: "/database",
          name: "Database",
          component: () =>
            import(/* webpackChunkName: "Database" */ "@/components/Settings/Database/index.vue")
        },
        {
          path: "/cloud",
          name: "Cloud",
          component: () =>
            import(/* webpackChunkName: "Cloud" */ "@/components/Settings/Cloud/index.vue")
        },
        // {
        //   path: "/users",
        //   name: "Users",
        //   component: () =>
        //     import(/* webpackChunkName: "Users" */ "@/components/Settings/Users/index.vue")
        // },
        {
          path: "/Stock",
          name: "Stock",
          component: () =>
            import(/* webpackChunkName: "Stock" */ "@/components/Stock/index.vue")
        },
        {
          path: "/Sell",
          name: "Sell",
          component: () =>
            import(/* webpackChunkName: "Sell" */ "@/components/Sell/index.vue")
        },
        {
          path: "/stats",
          component: () =>
            import(/* webpackChunkName: "Stats" */ "@/components/Stats/index.vue"),
          children: [
            {
              path: "/informes",
              component: () =>
                import(/* webpackChunkName: "Informes" */ "@/components/Stats/Informes/index.vue")
            },
            {
              path: "/ingresos",
              component: () =>
                import(/* webpackChunkName: "Ingresos" */ "@/components/Stats/Ingresos/index.vue")
            },
            {
              path: "/egresos",
              component: () =>
                import(/* webpackChunkName: "Egresos" */ "@/components/Stats/Egresos/index.vue")
            },
            {
              path: "/movimientos",
              component: () =>
                import(/* webpackChunkName: "Movimientos" */ "@/components/Stats/Movimientos/index.vue")
            },
            {
              path: "/Sells",
              name: "Sells",
              component: () =>
                import(/* webpackChunkName: "Sells" */ "@/components/Stats/Sells/index.vue")
            },
          ]
        },
        {
          path: "*",
          redirect: "/dashboard"
        }
      ]
    }
  ]
});

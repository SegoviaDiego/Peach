<template>
  <div class="dashgrid">
    <!-- Informes -->
    <div @click="goTo('/informes')" class="route">
      <div class="icon">
        <fontawesome icon="chart-line"/>
      </div>
      <div class="label">Informes</div>
    </div>
    <!-- Movimientos -->
    <div @click="goTo('/movimientos')" class="route">
      <div class="icon">
        <fontawesome icon="exchange-alt"/>
      </div>
      <div class="label">Movimientos</div>
    </div>
    <!-- Ingresos -->
    <div @click="goTo('/ingresos')" class="route">
      <div class="icon">
        <fontawesome icon="cart-plus"/>
      </div>
      <div class="label">Ingresos</div>
    </div>
    <!-- Egresos -->
    <div @click="goTo('/egresos')" class="route">
      <div class="icon">
        <fontawesome icon="cart-arrow-down"/>
      </div>
      <div class="label">Egresos</div>
    </div>
    <!-- Ventas -->
    <div @click="goTo('/Sells')" class="route" v-if="!preferences['systel']">
      <div class="icon">
        <fontawesome icon="dollar-sign"/>
      </div>
      <div class="label">Ventas</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { settings as types } from "@/vuexTypes";

export default Vue.extend({
  name: "statsDashboard",
  mounted() {
    this.$store.dispatch(types.loadPreferences);
  },
  computed: mapState({
    preferences: (state: any) => state.Settings.preferences,
    selectedRoute: (state: any) => state.Settings.statsSelectedRoute
  }),
  methods: {
    goBack() {
      this.$router.replace({ path: "/dashboard" });
    },
    goTo(route: any) {
      this.$router.replace({ path: route });
      this.$store.dispatch(types.setStatsRoute, route);
    }
  }
});
</script>

<style lang="scss" scoped>
.dashgrid {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  .route {
    cursor: pointer;
    flex: 1 1 1;
    width: 30%;
    margin: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #e1e2e1;
    border-radius: 5px;
    .icon {
      @media screen and (max-width: 899px) {
        font-size: 5em;
      }
      @media screen and (min-width: 900px) and (max-width: 999px) {
        font-size: 7em;
      }
      @media screen and (min-width: 1000px) and (max-width: 1299px) {
        font-size: 8em;
      }
      @media screen and (min-width: 1300px) {
        font-size: 10em;
      }
    }
    .label {
      font-family: Lato;
      font-weight: bold;
      font-size: 40px;
    }
  }
}
</style>
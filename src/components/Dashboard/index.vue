<template>
  <div class="dashboardGrid">
    <div class="header">
      <div class="title">
        ¡Bienvenido a la aplicación de Control de Negocio!
      </div>
      <div class="subTitle">
        Haz click en una de las secciones para continuar.      
      </div>
    </div>
    <div v-loading="isLoading" class="router">
      <div @click="goTo(1)" class="route">
        <div class="icon">
          <fontawesome icon="box-open" />
        </div>
        <div class="title">
          Stock
        </div>
      </div>
      <div v-if="!preferences['systel']" @click="goTo(2)" class="route">
        <div class="icon">
          <fontawesome icon="dollar-sign" />
        </div>
        <div class="title">
          Ventas
        </div>
      </div>
      <div @click="goTo(3)" class="route">
        <div class="icon">
          <fontawesome icon="chart-line" />
        </div>
        <div class="title">
          Informes
        </div>
      </div>
      <div @click="goTo(4)" class="route">
        <div class="icon">
          <fontawesome icon="cog" />
        </div>
        <div class="title">
          Configuracion
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { settings as types } from "@/vuexTypes";

export default Vue.extend({
  name: "app-main",
  mounted() {
    this.$store.dispatch(types.loadPreferences);
  },
  computed: mapState({
    isLoading: (state: any) => state.Settings.loading,
    preferences: (state: any) => state.Settings.preferences
  }),
  methods: {
    goTo(route: any) {
      switch (route) {
        case 1:
          this.$router.push("/stock");
          break;
        case 2:
          this.$router.push("/sell");
          break;
        case 3:
          this.$router.push("/stats");
          break;
        case 4:
          this.$router.push("/settings");
          break;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.dashboardGrid {
  flex: 1;

  display: grid;
  grid-template-areas: "header" "router";
  grid-template-rows: 1fr 6fr;
  grid-gap: 10px;

  overflow: hidden;
  .header {
    grid-area: header;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    font-family: Lato;
    font-weight: bold;
    color: black;
    .title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      font-size: 3em;
      text-align: center;
    }
    .subTitle {
      display: flex;
      flex-direction: column;
      text-align: center;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      font-size: 2em;
    }
  }
  .router {
    grid-area: router;
    padding: 0 10% 5% 10%;

    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "stock sells" "informes settings";
    grid-gap: 10px;

    overflow: hidden;
    .route {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      cursor: pointer;

      &:nth-of-type(1) {
        grid-area: stock;
        background-color: #ff9a69;
      }
      &:nth-of-type(2) {
        grid-area: sells;
        background-color: #ff7043;
      }
      &:nth-of-type(3) {
        grid-area: informes;
        background-color: #ffe365;
      }
      &:nth-of-type(4) {
        grid-area: settings;
        background-color: #e1e2e1;
      }
      .icon {
        flex: 2;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        font-size: 10em;
      }
      .title {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        font-size: 4em;
      }
    }
  }
}
</style>
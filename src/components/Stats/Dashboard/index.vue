<template>
  <div class="dashgrid">
    <!-- Informes -->
    <div @click="goTo(1)" class="route">
      <div class="icon">
        <fontawesome icon="chart-line" />
      </div>
      <div class="label">
        Informes
      </div>
    </div>
    <!-- Movimientos -->
    <div @click="goTo(2)" class="route">
      <div class="icon">
        <fontawesome icon="exchange-alt" />
      </div>
      <div class="label">
        Movimientos
      </div>
    </div>
    <!-- Ingresos -->
    <div @click="goTo(3)" class="route">
      <div class="icon">
        <fontawesome icon="cart-plus" />
      </div>
      <div class="label">
        Ingresos
      </div>
    </div>
    <!-- Egresos -->
    <div @click="goTo(4)" class="route">
      <div class="icon">
        <fontawesome icon="cart-arrow-down" />
      </div>
      <div class="label">
        Egresos
      </div>
    </div>
    <!-- Ventas -->
    <div @click="goTo(5)" class="route">
      <div class="icon">
        <fontawesome icon="dollar-sign" />
      </div>
      <div class="label">
        Ventas
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "statsDashboard",
  methods: {
    goBack() {
      this.$router.replace({ path: "/dashboard" });
    },
    goTo(id: number) {
      switch (id) {
        case 1:
          this.$router.replace({ path: "/informes" });
          break;
        case 2:
          this.$router.replace({ path: "/movimientos" });
          break;
        case 3:
          this.$router.replace({ path: "/ingresos" });
          break;
        case 4:
          this.$router.replace({ path: "/egresos" });
          break;
        case 5:
          this.$router.replace({ path: "/Sells" });
          break;
      }
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
      font-size: 14em;
    }
    .label {
      font-family: Lato;
      font-weight: bold;
      font-size: 40px;
    }
  }
}
</style>
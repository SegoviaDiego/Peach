<template>
  <div class="dashgrid">
    <Navbar/>
    <div class="content">
      <!-- Price manager -->
      <!-- <div @click="goTo('/priceManager')" class="route">
        <div class="icon">
          <fontawesome icon="money-bill-alt"/>
        </div>
        <div class="label">Precios</div>
      </div>-->
      <!-- Sales -->
      <!-- <div @click="goTo('/Sales')" class="route">
        <div class="icon">
          <fontawesome icon="hand-holding-usd"/>
        </div>
        <div class="label">Promociones</div>
      </div>-->
      <!-- Product composer -->
      <div @click="goTo('/ProductComposer')" class="route">
        <div class="icon">
          <fontawesome icon="puzzle-piece"/>
        </div>
        <div class="label">Productos Compuestos</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "./navbar.vue";

export default Vue.extend({
  name: "OpcionesAvanzadasDashboard",
  components: {
    Navbar
  },
  methods: {
    goTo(route: any) {
      this.$router.replace({ path: route });
    }
  }
});
</script>

<style lang="scss" scoped>
.dashgrid {
  flex: 1;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 9fr;
  grid-template-areas: "navbar" "content";
  overflow: hidden;
  .content {
    flex: 1;
    grid-area: content;
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
}
</style>
<template>
  <div class="opcionesAvanzadasNavbarFlex">
    <div class="searchbar">
      <div class="container">
        <div class="inputContainer">
          <input
            :value="filter"
            @input="filterChanged($event.target.value)"
            placeholder="Buscar producto"
            type="text"
          >
        </div>
        <div class="icon">
          <fontawesome icon="search"/>
        </div>
      </div>
    </div>
    <div class="buttons">
      <!-- Go back button -->
      <button @click="goBack">Volver atras</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { products as types } from "@/vuexTypes";

export default Vue.extend({
  name: "OpcionesAvanzadas-navbar",
  props: {
    products: Array,
    selection: {}
  },
  computed: mapState({
    filter: (state: any) => state.Product.filter
  }),
  methods: {
    filterChanged(value: any) {
      this.$store.dispatch(types.filter, value);
    },
    goBack() {
      this.$router.replace({ path: "/OpcionesAvanzadas" });
    }
  }
});
</script>

<style lang="scss" scoped>
.opcionesAvanzadasNavbarFlex {
  flex: 1;
  grid-area: navbar;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "searchbar buttons";
  padding: 0 10px;
  .searchbar {
    height: 55px;
    $radius: 30px;
    grid-area: searchbar;
    display: flex;
    background-color: #fdd835;
    border-bottom-left-radius: $radius;
    border-top-right-radius: $radius;
    padding: 0px $radius;
    overflow: hidden;
    .container {
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background-color: #e1e2e1;
    }
    .inputContainer {
      flex: 8;
      height: 100%;
      background-color: transparent;
      input {
        padding: 0px 10px;
        font-size: 20px;
        font-weight: bold;
        width: 100%;
        height: 100%;
        border-color: none;
        outline: none;
        background-color: transparent !important;
        border: none;
        border-radius: none;
        box-shadow: none;
      }
    }
    .icon {
      flex: 1;
      height: 100%;
      display: flex;
      margin-right: 15px;
      justify-content: flex-end;
      align-items: center;
      font-size: 34px;
      color: #3d3d3d;
    }
  }
  .buttons {
    grid-area: buttons;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    button {
      color: black;
      background-color: #fdd835;
      height: 55px;
      min-width: 130px;
      border: none;
      padding: 15px 20px;
      text-decoration: none;
      text-transform: uppercase;
      border-radius: 40px;
      font-family: Lato;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      transition: 300ms;
      &:hover {
        color: #ff5722;
      }
    }
  }
}
</style>
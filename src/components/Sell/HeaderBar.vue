<template>
  <div class="header">
    <div class="searchbar">
      <div class="container">
        <div class="inputContainer">
          <input
              :value="filter"
              @input="filterChanged($event.target.value)"
              placeholder="Buscar producto" type="text">
        </div>
        <div class="icon">
          <fontawesome icon="search" />
        </div>
      </div>
    </div>
    <div class="buttons">
      <button @click="goBack()" class="rounded">
        Volver atras
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { products as types, sell as sellTypes } from "@/vuexTypes";
import _ from "lodash";

export default Vue.extend({
  name: "sell-header",
  computed: mapState({
    isLoading: (state: any) => state.Product.loading,
    showSpinner: (state: any) => state.Product.showSpinner,
    route: (state: any) => state.Product.buttonRoute,
    filter: (state: any) => state.Product.filter
  }),
  data: () => ({
    type: null,
    routes: types.routes
  }),
  methods: {
    filterChanged(value: any) {
      this.$store.dispatch(types.filter, value);
    },
    print() {
      this.$emit("print");
    },
    goBack() {
      this.$store.dispatch(sellTypes.clearSells);
      this.$router.replace({ path: "/dashboard" });
    },
    saveInStock() {
      let amount = _.pickBy(this.amount, _.identity);
      if (_.isEmpty(amount)) {
        this.$notify({
          title: "Ingreso vacio!",
          message: "No has colocado ningun valor al ingreso.",
          type: "warning",
          duration: 5000,
          offset: 170
        });
      } else {
        this.$store.dispatch(types.inStock, { amount, magnitude: 2 });
        this.goTo(types.routes.default, types.routes.inStock);
      }
    },
    saveOutStock() {
      let amount = _.pickBy(this.amount, _.identity);
      if (!this.type) {
        this.$notify({
          title: "No has seleccionado un tipo de egreso",
          message:
            "Antes de guardar los cambios debes elegir el tipo de egreso (Transferencia, reciclado o baja)",
          type: "warning",
          duration: 5000,
          offset: 170
        });
      } else if (_.isEmpty(amount)) {
        this.$notify({
          title: "Egreso vacio!",
          message: "No has colocado ningun valor al egreso.",
          type: "warning",
          duration: 5000,
          offset: 170
        });
      } else {
        this.$store.dispatch(types.outStock, {
          amount: amount,
          type: this.type,
          magnitude: 2
        });
        this.goTo(types.routes.default, types.routes.outStock);
      }
    },
    validateItem() {
      if (!this.newItem) {
        console.log(1);
        return;
      }
      if (!this.newItem) {
        console.log(2);
        return;
      }
      this.$store.dispatch(types.create, this.newItem);
      this.goTo(types.routes.default, types.routes.createItem);
    },
    saveChanges() {
      // this.amount = [];
    },
    saveDeletes() {
      this.$store.dispatch(types.delete, this.selected);
      this.goTo(types.routes.default, types.routes.deleteItems);
    }
  }
});
</script>

<style lang="scss" scoped>
.header {
  grid-area: header;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "searchbar buttons";
  // padding: 0 2%;
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
      margin-left: 5px;
      transition: 300ms;
      &:hover {
        color: #ff5722;
      }
    }
    .rounded {
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
    }
    .circle {
      &.gray {
        background-color: #e1e2e1;
      }
      background-color: #fdd835;
      height: 55px;
      width: 55px;
      border: none;
      text-decoration: none;
      text-transform: uppercase;
      border-radius: 50%;
      cursor: pointer;
      font-size: 24px;
    }
    .select {
      margin-left: 10px;
    }
  }
}
</style>
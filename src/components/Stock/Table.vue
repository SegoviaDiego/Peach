<template>
  <div class="table">
    <div class="header">
      <div class="column">
        Codigo
      </div>
      <div class="column">
        Producto
      </div>
      <div class="column">
        Precio
      </div>
      <div class="column">
        En Stock
      </div>
      <template v-if="route === routes.inStock || route === routes.outStock">
        <div class="column">
          Cantidad
        </div>
      </template>
    </div>
    <div class="body" v-loading="isLoading">
      <div v-if="route === routes.createItem" class="row">
        <div class="column">
          <input placeholder="Codigo" type="text" v-model.lazy="newItem._id">
        </div>
        <div class="column">
          <input placeholder="Nombre" type="text" v-model.lazy="newItem.name">
        </div>
        <div class="column">
          <input placeholder="Precio" type="number" min="0" v-model.lazy="newItem.price">
        </div>
        <div class="column">
        </div>
      </div>
      <template v-for="item in products">
        <template v-if="item._id != 99998 && item._id != 99999">
          <div
          :key="item._id"
          class="row">
            <div class="column">
                {{item._id}}
            </div>
            <div class="column">
              <template v-if="route === routes.editItems">
                <input
                  :value="changes[item._id]['name']"
                  @change="editValue(item._id, 'name' , $event.target.value)"
                  :placeholder="item.name" type="text">
              </template>
              <template v-else>
                {{item.name}}
              </template>
            </div>
            <div class="column">
              <template v-if="route === routes.editItems">
                <input
                  :value="changes[item._id]['price']"
                  @change="editValue(item._id, 'price' , $event.target.value)"
                  :placeholder="item.price" type="number" min="0">
              </template>
              <template v-else>
                {{item.price}}
              </template>
            </div>
            <div class="column">
              {{toMagnitude(item.stock, item.type)}}
            </div>
            <template v-if="route === routes.inStock || route === routes.outStock">
              <div class="column">
                <el-input
                  :min="0"
                  :step="item.type == 1 ? 0.1 : 1"
                  type="number"
                  :value="inputs[item._id] ? inputs[item._id].input : 0"
                  @input="handleChange(item, $event)"
                  placeholder="Cantidad"/>
              </div>
            </template>
          </div>
        </template>
      </template>
    </div>
    <div class="background">
      <div class="header"/>
      <div class="body">
        <div class="column darker"></div>
        <div class="column"></div>
        <div class="column darker"></div>
        <div class="column"></div>
        <div class="column darker"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { products as types } from "@/vuexTypes";

import { composeMagnitude as toMagnitude } from "@/Server/mongodb/Utils";

export default Vue.extend({
  name: "products-table",
  props: {
    products: Array,
    newItem: {},
    selected: {},
    changes: {}
  },
  data: () => ({
    routes: types.routes
  }),
  computed: mapState({
    isLoading: (state: any) => state.Product.loading,
    inputs: (state: any) => state.Product.inputs,
    showSpinner: (state: any) => state.Product.showSpinner,
    route: (state: any) => state.Product.buttonRoute
  }),
  methods: {
    toMagnitude: toMagnitude,
    handleChange(item: any, input: any) {
      this.$store.dispatch(types.handleChange, {
        item,
        input: parseFloat(input)
      });
    }
  }
});
</script>

<style lang="scss" scoped>
$scrollbarSize: 16px;
.table {
  position: relative;
  grid-area: table;
  $fontColor: #000;

  display: grid;
  grid-template-rows: 1fr 9fr;
  grid-template-columns: 1fr;
  grid-template-areas: "header" "body";
  min-height: 0;
  .header {
    padding-right: $scrollbarSize;
    grid-area: header;
    z-index: 2;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 3fr 1fr 1fr 3fr;
    .column {
      display: flex;
      align-items: center;
      padding-left: 10px;
      align-items: center;
      color: $fontColor;
      font-size: 28px;
      font-family: Lato;
      font-weight: bold;
      overflow: hidden;
    }
  }
  .body {
    grid-area: body;
    z-index: 2;
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: $scrollbarSize;
    }
    &::-webkit-scrollbar-track {
      background-color: #e1e2e1;
    }
    &::-webkit-scrollbar-thumb {
      $borderSize: 7px;
      background-color: #3d3d3d;
      // border-top: $borderSize solid black;
      // border-bottom: $borderSize solid black;
    }
    .row {
      margin: 10px 0px;
      $h: 40px;
      $fs: 25px;
      min-height: $h;
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: 1fr 3fr 1fr 1fr 3fr;
      .column {
        overflow: hidden;
        display: flex;
        padding: 0 $scrollbarSize;
        align-items: center;
        color: $fontColor;
        font-size: $fs;
        font-family: Lato;
        font-weight: bold;
        input {
          & {
            width: 100%;
            flex: 1;
            color: #000;
            border: none;
            border-bottom: 2px solid #ff8a50;
            text-decoration: none;
            outline: none;
            background-color: transparent;
            font-family: Lato;
            font-weight: bold;
            font-size: $fs - 5px;
            transition: 0.2s ease;
            &:focus {
              border-bottom: 4px solid #ff8a50;
            }
          }
          &[type="checkbox"] {
            $size: 25px;
            border-radius: 50px;
            height: $size;
            width: $size;
            color: #000;
            background-color: #c4c4c4;
            cursor: pointer;
          }
        }
      }
    }
  }
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(225, 226, 225, 0.36);
    display: flex;
    flex-direction: column;
    .header {
      flex: 1;
      background-color: #e1e2e1;
    }
    .body {
      margin-right: $scrollbarSize;
      flex: 9;
      display: flex;
      flex-direction: row;
      .column {
        flex: 1;
      }
      .column:nth-of-type(2) {
        flex: 3;
      }
      .column:nth-of-type(5) {
        flex: 3;
      }
      .darker {
        background-color: rgba(225, 226, 225, 0.56);
      }
    }
  }
}
</style>
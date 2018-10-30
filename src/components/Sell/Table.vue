<template>
  <div class="table">
    <div class="header">
      <div class="column">
        Producto
      </div>
      <div class="column">
        Precio
      </div>
      <div class="column">
        En Stock
      </div>
      <div class="column">
        Cantidad
      </div>
    </div>
    <div class="body" v-loading="isLoading">
      <div
      v-for="item in products"
      :key="item._id"
      class="row">
        <div class="column">
          {{item.name}}
        </div>
        <div class="column">
          {{item.price}}
        </div>
        <div class="column">
          {{composeMagnitude(item.stock, item.type)}}
        </div>
        <div class="column">
          <el-input
          :max="getProductMaxInputVal(item.stock)"
          :min="0"
          :step="getProductTypeStep(item.type)"
          type="number"
          :value="getSellAmount(item._id)"
          @input="handleChange(item, $event)"
          placeholder="Cantidad vendida"/>
        </div>
      </div>
    </div>
    <div class="background">
      <div class="header"/>
      <div class="body">
        <div class="column darker"></div>
        <div class="column"></div>
        <div class="column darker"></div>
        <div class="column"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { sell as types } from "@/vuexTypes";

import {
  composeMagnitude,
  toMagnitude,
  getProductMaxInputVal,
  getProductTypeStep
} from "@/Server/mongodb/Utils";

function addKeyValues(obj: any) {
  let values = "";
  for (let val of Object.values(obj)) {
    values += val;
  }
  return values.toLowerCase();
}
function filterData(data: any, filter: any) {
  return data.filter((item: any) => {
    return addKeyValues(item).includes(filter.toLowerCase());
  });
}
function sortData(data: any) {
  return data.sort((a: any, b: any) => {
    return a._id - b._id;
  });
}

export default Vue.extend({
  name: "sell-table",
  computed: mapState({
    sells: (state: any) => state.Sell.data,
    isLoading: (state: any) => state.Product.loading,
    filter: (state: any) => state.Product.filter,
    products(state: any) {
      return sortData(filterData([...state.Product.data], this.filter));
    }
  }),
  methods: {
    composeMagnitude: composeMagnitude,
    getProductMaxInputVal: getProductMaxInputVal,
    getProductTypeStep: getProductTypeStep,
    handleChange(item: any, amount: any) {
      this.$store.dispatch(types.handleChange, {
        item,
        amount: parseFloat(amount),
        money: parseFloat(item.price) * parseFloat(amount)
      });
    },
    getSellAmount(id: any) {
      if (this.sells[id]) return this.sells[id].amount;
      return 0;
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
    grid-template-columns: 3fr 2fr 2fr 2fr;
    .column {
      display: flex;
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
      grid-template-columns: 3fr 2fr 2fr 2fr;
      .column {
        overflow: hidden;
        display: flex;
        padding: 0 $scrollbarSize;
        // align-items: center;
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
      grid-template-columns: 3fr 2fr 2fr 2fr;
      .column {
        flex: 2;
      }
      .column:nth-of-type(1) {
        flex: 3;
      }
      .column:nth-of-type(4) {
        // flex: 3;
      }
      .darker {
        background-color: rgba(225, 226, 225, 0.56);
      }
    }
  }
}
</style>
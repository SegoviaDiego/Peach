<template>
  <OxyTable v-model="products">
    <!-- Crear productgo -->
    <Row slot="firstRow" v-if="route === routes.createItem">
      <Cell label="Codigo" :colSpan="1" isNumber>
        <input placeholder="Codigo" type="number" min="0" v-model="newItem._id">
      </Cell>
      <Cell label="Nombre" :colSpan="2">
        <input placeholder="Nombre" type="text" v-model="newItem.name">
      </Cell>
      <Cell label="Tipo" :colSpan="1">
        <el-select v-model="newItem.type" placeholder="Tipo">
          <el-option label="Unidad" :value="0"/>
          <el-option label="Kilogramo" :value="1"/>
          <el-option label="Metro" :value="2"/>
        </el-select>
      </Cell>
      <Cell label="Precio" :colSpan="1">
        <input placeholder="Precio" type="number" min="0" step="0.01" v-model="newItem.price">
      </Cell>
      <Cell label="Stock" :colSpan="1">0</Cell>
    </Row>
    <!-- Rows -->
    <Row slot="row" slot-scope="item" :key="item._id" v-if="item._id != 99998 && item._id != 99999">
      <Cell label="Codigo" sortBy="_id" :colSpan="1" isNumber>{{item._id}}</Cell>
      <Cell label="Producto" sortBy="name" :colSpan="2">
        <template v-if="route === routes.editItems">
          <input v-model="mutatedProducts[item._id]['name']" :placeholder="item.name" type="text">
        </template>
        <template v-else>{{item.name}}</template>
      </Cell>
      <Cell label="Tipo" :colSpan="1">{{getProductTypeLabel(item.type)}}</Cell>
      <Cell label="Precio" sortBy="price" :colSpan="1">
        <template v-if="route === routes.editItems">
          <input
            v-model="mutatedProducts[item._id]['price']"
            :placeholder="item.price"
            type="number"
            min="0"
          >
        </template>
        <template v-else>{{item.price}}</template>
      </Cell>
      <Cell label="Stock" sortBy="stock" :colSpan="1">{{composeMagnitude(item.stock, item.type)}}</Cell>
      <Cell
        :label="getActionColLabel()"
        :colSpan="1"
        v-if="route === routes.inStock ||
              route === routes.outStock ||
              route === routes.deleteItems"
      >
        <template v-if="route === routes.deleteItems">
          <el-checkbox class="deleteBox" v-model="deleteSelection[item._id]"/>
        </template>
        <template v-if="route === routes.inStock || route === routes.outStock">
          <el-input
            :min="0"
            :step="getProductTypeStep(item.type)"
            type="number"
            :value="inputs[item._id] ? inputs[item._id].input : 0"
            @input="handleChange(item, $event)"
            placeholder="Cantidad"
          />
        </template>
      </Cell>
    </Row>
  </OxyTable>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { products as types } from "@/vuexTypes";
import {
  composeMagnitude,
  getProductTypeLabel,
  getProductTypeStep
} from "@/api/Utils";

import OxyTable from "@/components/Table/index.vue";
import Row from "@/components/Table/Row.vue";
import Cell from "@/components/Table/Cell.vue";

export default Vue.extend({
  name: "products-table",
  components: {
    OxyTable,
    Row,
    Cell
  },
  props: {
    products: Array,
    newItem: {},
    deleteSelection: {},
    mutatedProducts: {}
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
    getProductTypeLabel: getProductTypeLabel,
    getProductTypeStep: getProductTypeStep,
    composeMagnitude: composeMagnitude,
    getActionColLabel() {
      if (
        this.route === this.routes.inStock ||
        this.route === this.routes.outStock
      ) {
        return "Cantidad";
      }
      return "";
    },
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
$gridColumnsTemplate: 1fr 2fr 1fr 1fr 1fr 1fr;
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
    grid-template-columns: $gridColumnsTemplate;
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
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: $scrollbarSize;
    }
    &::-webkit-scrollbar-track {
      background-color: #e1e2e1;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #3d3d3d;
    }
    .row {
      margin: 10px 0px;
      $h: 40px;
      $fs: 25px;
      min-height: $h;
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: $gridColumnsTemplate;
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
      // margin-right: $scrollbarSize;
      flex: 9;
      display: flex;
      flex-direction: row;
      .column {
        flex: 1;
      }
      .column:nth-of-type(1) {
        background-color: rgba(225, 226, 225, 0.56);
      }
      .column:nth-of-type(2) {
        flex: 2;
      }
      .column:nth-of-type(3) {
        background-color: rgba(225, 226, 225, 0.56);
      }
      .column:nth-of-type(5) {
        background-color: rgba(225, 226, 225, 0.56);
      }
      .column:nth-of-type(6) {
        flex: 1;
      }
    }
  }
}
</style>
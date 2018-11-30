<template>
  <OxyTable v-model="products">
    <Row slot="row" slot-scope="item" :key="item._id">
      <Cell label="Codigo" sortBy="_id" :colSpan="1">{{item._id}}</Cell>
      <Cell label="Producto" sortBy="name" :colSpan="2">{{item.name}}</Cell>
      <Cell label="Precio" sortBy="price" :colSpan="1">{{item.price}}</Cell>

      <Cell label="Stock" sortBy="stock" :colSpan="1">{{composeMagnitude(item.stock, item.type)}}</Cell>

      <Cell label="Venta" :colSpan="1">
        <el-input
          :max="getProductMaxInputVal(item.stock)"
          :min="0"
          :step="getProductTypeStep(item.type)"
          type="number"
          :value="getSellAmount(item._id)"
          @input="handleChange(item, $event)"
          placeholder="Cantidad vendida"
        />
      </Cell>
    </Row>
  </OxyTable>
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
} from "@/api/Utils";

import OxyTable from "@/components/Table/index.vue";
import Row from "@/components/Table/Row.vue";
import Cell from "@/components/Table/Cell.vue";

function filterData(data: any, filter: any) {
  if (!filter) {
    return data;
  } else if (isNaN(filter)) {
    return data.filter((item: any) => {
      return item["name"].toLowerCase().includes(filter.toLowerCase());
    });
  } else {
    return data.filter((item: any) => {
      return parseFloat(item._id) == parseFloat(filter);
    });
  }
}
function sortData(data: any) {
  return data.sort((a: any, b: any) => {
    return a._id - b._id;
  });
}

export default Vue.extend({
  name: "sell-table",
  components: {
    OxyTable,
    Row,
    Cell
  },
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
.table {
  flex: 1;
  // display: grid;
  // grid-row-gap: 20px;
  // grid-template-rows: 55px 1fr;
  // grid-template-columns: 1fr;
  // grid-template-areas:
  //   "header"
  //   "table";
  // overflow: hidden;
}
</style>
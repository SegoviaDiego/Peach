<template>
  <OxyTable v-model="products">
    <!-- Rows -->
    <Row
      slot="row"
      slot-scope="item"
      :key="item._id"
      v-show="item._id != 99998 && item._id != 99999"
    >
      <Cell label="Codigo" sortBy="_id" :colSpan="1" isNumber>{{item._id}}</Cell>
      <Cell label="Producto" sortBy="name" :colSpan="2">{{item.name}}</Cell>
      <Cell label="Tipo" :colSpan="1">{{getProductTypeLabel(item.type)}}</Cell>
      <Cell label="Precio" sortBy="price" :colSpan="1" isNumber>{{item.price}}</Cell>
      <Cell label="Seleccionar" :colSpan="1">
        <el-checkbox class="deleteBox" v-model="selection[item._id]"/>
      </Cell>
    </Row>
  </OxyTable>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { getProductTypeLabel } from "@/api/Utils";

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
    selection: {}
  },
  methods: {
    getProductTypeLabel: getProductTypeLabel
  }
});
</script>

<style lang="scss" scoped>
</style>
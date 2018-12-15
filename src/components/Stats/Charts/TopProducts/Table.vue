<template>
  <div class="grid">
    <Toolbar/>
    <OxyTable v-model="filteredData">
      <Row slot="row" slot-scope="top" :key="top.item.name">
        <Cell label="Producto" :colSpan="3">{{top.item.name}}</Cell>
        <Cell label="Cantidad" :colSpan="1">{{composeMagnitude(top.amount, top.item.type)}}</Cell>
      </Row>
    </OxyTable>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";

import Toolbar from "./Toolbar.vue";

import OxyTable from "@/components/Table/index.vue";
import Row from "@/components/Table/Row.vue";
import Cell from "@/components/Table/Cell.vue";

import { composeMagnitude } from "@/api/Utils";
import { chart as types } from "@/vuexTypes";

function filterData(data, filter) {
  if (!filter) return data;
  return data.filter(item => {
    return item["name"].toLowerCase().includes(filter.toLowerCase());
  });
}

export default Vue.extend({
  name: "informes-table",
  components: {
    Toolbar,
    OxyTable,
    Row,
    Cell
  },
  mounted() {
    this.$store.dispatch(types.loadTopProducts);
  },
  data: () => ({
    openPrintDialog: false
  }),
  computed: mapState({
    isLoading: state => state.Chart.loading,
    filteredData(state) {
      return filterData(state.Chart.topProducts, state.Chart.filter);
    }
  }),
  methods: {
    composeMagnitude: composeMagnitude,
    closePrintDialog() {
      this.openPrintDialog = false;
    },
    print() {
      this.openPrintDialog = true;
    }
  }
});
</script>

<style lang="scss" scoped>
.grid {
  flex: 1;
  padding: 10px;
  grid-area: table;
  display: grid;
  grid-template-rows: 70px 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: "toolbar" "table";
  overflow: hidden;
  background-color: #eeeeee;
  border-radius: 7px;
}
</style>
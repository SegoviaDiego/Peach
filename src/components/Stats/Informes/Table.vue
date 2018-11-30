<template>
  <div class="grid">
    <Toolbar/>
    <OxyTable v-model="filteredData">
      <Row slot="row" slot-scope="total" :key="total._id">
        <Cell label="Producto" sortBy="item.name" :colSpan="2">{{total.item.name}}</Cell>
        <Cell label="Precio" sortBy="item.price" :colSpan="1">$ {{total.item.price}}</Cell>
        <Cell
          label="Cantidad"
          sortBy="amount"
          :colSpan="1"
        >{{composeMagnitude(total.amount, total.item.type)}}</Cell>
        <Cell label="Total" sortBy="money" :colSpan="1">$ {{(total.money).toFixed(2)}}</Cell>
      </Row>
    </OxyTable>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import Toolbar from "./Toolbar.vue";
import { totals as types } from "@/vuexTypes";
import { composeMagnitude } from "@/api/Utils";
import OxyTable from "@/components/Table/index.vue";
import Row from "@/components/Table/Row.vue";
import Cell from "@/components/Table/Cell.vue";

// Agrupacion de las ventas de todos los cierres que se hicieron en el dia
function getTotal(cierres) {
  let res = {};
  let total;

  for (let cierre of cierres) {
    for (let i of cierre.data) {
      total = { ...i };

      if (!res[total.item._id]) {
        res[total.item._id] = total;
      } else {
        res[total.item._id].money += total.money;
        res[total.item._id].amount += total.amount;
      }
    }
  }

  return _.map(res);
}

function filterData(data, filter) {
  if (!filter) {
    return data;
  } else if (isNaN(filter)) {
    return data.filter(total => {
      return total.item["name"].toLowerCase().includes(filter.toLowerCase());
    });
  } else {
    return data.filter(item => {
      return parseFloat(item._id) == parseFloat(filter);
    });
  }
}
function sortData(data) {
  // Sort de la lista de totales. a y b son objetos total = {amount, item, money}
  return data.sort((a, b) => {
    return parseInt(a.item._id) - parseInt(b.item._id);
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
  data: () => ({
    totalIndex: types.totalIndex,
    openPrintDialog: false
  }),
  computed: mapState({
    isLoading: state => state.Total.loading,
    current: state => state.Total.data,
    cierreIndex: state => state.Total.cierreIndex,
    cierre() {
      if (this.cierreIndex == this.totalIndex && this.current)
        return getTotal(this.current.cierres);
      if (this.current)
        if (this.current.cierres)
          if (this.current.cierres.length >= this.cierreIndex)
            return this.current.cierres[this.cierreIndex - 1].data;
      return [];
    },
    filteredData(state) {
      return sortData(filterData([...this.cierre], state.Total.filter));
    }
  }),
  methods: {
    composeMagnitude: composeMagnitude
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
  // .table {
  //   grid-area: table;
  //   flex: 1;
  //   display: grid;
  //   grid-template-rows: 1fr;
  //   grid-template-columns: 1fr;
  //   overflow: hidden;
  // }
}
</style>
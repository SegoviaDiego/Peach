<template>
  <div class="grid">
    <Toolbar/>
    <OxyTable v-model="filteredData">
      <Row slot="row" slot-scope="sell" :key="sell._id">
        <Cell label="Hora" sortBy="time" :colSpan="1">{{toHour(new Date(sell.time))}}</Cell>
        <Cell label="Efectivo" :colSpan="2">{{getPayDivision(sell, 'efectivo')}}</Cell>
        <Cell label="Credito" :colSpan="2">{{getPayDivision(sell, 'credito')}}</Cell>
        <Cell label="Recargo" :colSpan="2">{{getPayDivision(sell, 'recargo')}}</Cell>
        <Cell label="Debito" :colSpan="2">{{getPayDivision(sell, 'debito')}}</Cell>
        <Cell label="Total" sortBy="total" :colSpan="2">$ {{sell.total.toFixed(2)}}</Cell>
      </Row>
    </OxyTable>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import Toolbar from "./Toolbar.vue";
import { sell as types } from "@/vuexTypes";
import { composeMagnitude, toMagnitude, toHour } from "@/api/Utils";
import OxyTable from "@/components/Table/index.vue";
import Row from "@/components/Table/Row.vue";
import Cell from "@/components/Table/Cell.vue";

function filterData(data, filter) {
  if (!filter) {
    return data;
  } else if (isNaN(filter)) {
    return data.filter(item => {
      return item["name"].toLowerCase().includes(filter.toLowerCase());
    });
  } else {
    return data.filter(item => {
      return parseFloat(item._id) == parseFloat(filter);
    });
  }
}
function sortData(data) {
  return data.sort((a, b) => {
    return new Date(b.time) - new Date(a.time);
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
    
  },
  data: () => ({
    openPrintDialog: false
  }),
  computed: mapState({
    filter: state => state.Log.filter,
    date: state => {
      return state.Log.date || new Date();
    },
    isLoading: state => state.Sell.loading,
    showSpinner: state => state.Sell.showSpinner,
    filteredData(state) {
      return sortData(filterData(_.toArray(state.Sell.sells), this.filter));
    }
  }),
  methods: {
    toMagnitude: toMagnitude,
    composeMagnitude: composeMagnitude,
    toHour: toHour,
    getPayDivision(sell, type) {
      if (sell.systel) {
        return "-";
      } else if (sell.payDivision && sell.payDivision[type]) {
        return `$ ${sell.payDivision[type].toFixed(2)}`;
      }
      return "$ 0";
    },
    getType(type) {
      switch (type) {
        case 1:
          return "Vencimiento";
        case 2:
          return "Reciclado";
        case 3:
          return "Transferencia";
        default:
          return "";
      }
    },
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
// Scrollbar
$sbSize: 10px;
// Grid
$tableColumnTemplate: 1fr 2fr 2fr 2fr 2fr 2fr;
// Head options
$hFontColor: #000;
$hFontSize: 20px;
// Body options
$bFontSize: 17px;
$bFontColor: #a0a0a0;

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
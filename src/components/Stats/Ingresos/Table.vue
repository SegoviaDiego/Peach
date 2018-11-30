<template>
  <div class="grid">
    <Toolbar/>
    <OxyTable v-model="filteredData">
      <Row slot="row" slot-scope="log" :key="log._id">
        <Cell label="Hora" sortBy="time" :colSpan="1">{{toHour(new Date(log.time))}}</Cell>
        <Cell label="Producto" sortBy="item.name" :colSpan="3">{{log.item.name}}</Cell>
        <Cell label="Cantidad" :colSpan="2">{{composeMagnitude(log.amount, log.item.type)}}</Cell>
        <Cell
          label="Valor"
          :colSpan="2"
        >${{(log.item.price * toMagnitude(log.amount, log.item.type)).toFixed(2)}}</Cell>
      </Row>
    </OxyTable>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import Toolbar from "./Toolbar.vue";
import { log as types } from "@/vuexTypes";
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
    this.$store.dispatch(types.loadIngreso);
  },
  data: () => ({
    openPrintDialog: false
  }),
  computed: mapState({
    filter: state => state.Log.filter,
    isLoading: state => state.Log.loading,
    showSpinner: state => state.Log.showSpinner,
    filteredData(state) {
      return sortData(filterData([...state.Log.ingreso], this.filter));
    }
  }),
  methods: {
    toMagnitude: toMagnitude,
    composeMagnitude: composeMagnitude,
    toHour: toHour,
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
$tableColumnTemplate: 1fr 3fr 2fr 2fr;
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
  .table {
    grid-area: table;
    width: 100%;
    height: 100%;
  }
  .head {
    margin-right: $sbSize;
    grid-area: head;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: $tableColumnTemplate;
    .column {
      display: flex;
      padding-left: 10px;
      align-items: center;
      color: $hFontColor;
      font-size: $hFontSize;
      font-family: Lato;
      font-weight: bold;
      overflow: hidden;
    }
  }
  .body {
    grid-area: body;
    overflow-x: hidden;
    overflow-y: scroll;
    margin-bottom: 10px;
    &::-webkit-scrollbar {
      width: $sbSize;
    }
    &::-webkit-scrollbar-track {
      background-color: #e1e2e1;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background: $bFontColor;
      border-radius: 10px;
    }
    .row {
      margin: 7px 0px;
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: $tableColumnTemplate;
      .column {
        overflow: hidden;
        display: flex;
        padding: 0 $sbSize;
        color: $bFontColor;
        font-size: $bFontSize;
        font-family: Lato;
        font-weight: bold;
      }
    }
  }
}
</style>
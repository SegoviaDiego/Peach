<template>
  <div class="grid">
    <Toolbar/>
    <div class="head">
      <div class="column">
        Hora
      </div>
      <div class="column">
        Efectivo
      </div>
      <div class="column">
        Credito
      </div>
      <div class="column">
        Recargo
      </div>
      <div class="column">
        Debito
      </div>
      <div class="column">
        Total
      </div>
    </div>
    <div class="body">
      <template v-for="sell in filteredData">
        <div :key="sell._id.toString()" class="row">
          <div class="column">
            {{toHour(sell.time)}}
          </div>
          <div class="column">
            {{getPayDivision(sell, 'efectivo')}}
          </div>
          <div class="column">
            {{getPayDivision(sell, 'credito')}}
          </div>
          <div class="column">
            {{getPayDivision(sell, 'recargo')}}
          </div>
          <div class="column">
            {{getPayDivision(sell, 'debito')}}
          </div>
          <div class="column">
            $ {{sell.total.toFixed(2)}}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";

import Log from "@/Server/mongodb/Log";
import Toolbar from "./Toolbar.vue";
import { sell as types } from "@/vuexTypes";

import { composeMagnitude, toMagnitude, toHour } from "@/Server/mongodb/Utils";

function addKeyValues(obj) {
  let values = "";
  for (let val of Object.values(obj)) {
    values += val;
  }
  return values.toLowerCase();
}
function filterData(data, filter) {
  return data.filter(item => {
    return addKeyValues(item).includes(filter.toLowerCase());
  });
}
function sortData(data) {
  return data.sort((a, b) => {
    return b.time - a.time;
  });
}

export default Vue.extend({
  name: "informes-table",
  components: {
    Toolbar
  },
  mounted() {
    this.$store.dispatch(types.load, this.date);
  },
  data: () => ({
    openPrintDialog: false
  }),
  computed: mapState({
    filter: state => state.Log.filter,
    date: state => state.Log.date,
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
  grid-template-rows: 70px 50px 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: "toolbar" "head" "body";
  overflow: hidden;
  background-color: #eeeeee;
  border-radius: 7px;
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
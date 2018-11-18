<template>
  <div class="grid">
    <Toolbar/>
    <div class="head">
      <div class="column">
        Articulo
      </div>
      <div class="column">
        Precio
      </div>
      <div class="column">
        Cantidad
      </div>
      <div class="column">
        Total
      </div>
    </div>
    <div class="body" v-loading="isLoading">
      <template v-if="cierreIndex == null">
        No has seleccionado un cierre
      </template>
      <template v-else-if="cierre.length <= 0">
        No se realizaron ventas el cierre seleccionado
      </template>
      <template v-else v-for="total in filteredData">
        <div :key="total._id" class="row">
          <div class="column">
            {{total.item.name}}
          </div>
          <div class="column">
            $ {{total.item.price}}
          </div>
          <div class="column">
            {{composeMagnitude(total.amount, total.item.type)}}
          </div>
          <div class="column">
            $ {{(total.money).toFixed(2)}}
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
import { totals as types } from "@/vuexTypes";

import { composeMagnitude } from "@/Server/mongodb/Utils";

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
  // Sort de la lista de totales. a y b son objetos total = {amount, item, money}
  return data.sort((a, b) => {
    return parseInt(a.item._id) - parseInt(b.item._id);
  });
}

export default Vue.extend({
  name: "informes-table",
  components: {
    Toolbar
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
// Scrollbar
$sbSize: 10px;
// Grid
$tableColumnTemplate: 2fr 1fr 1fr 1fr;
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
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
        No se realizaron ventas el dia seleccionado
      </template>
      <template v-else v-for="total in filteredData">
        <div :key="total._id" class="row">
          <div class="column">
            {{products[total._id].name}}
          </div>
          <div class="column">
            $ {{products[total._id].price}}
          </div>
          <div class="column">
            {{composeMagnitude(total.amount, products[total._id].type)}}
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

function getTotal(cierres) {
  let total = {};
  let item;

  for (let cierre of cierres) {
    for (let i of cierre.data) {
      item = { ...i };

      if (!total[item._id]) total[item._id] = item;
      else {
        total[item._id].money += item.money;
        total[item._id].amount += item.amount;
      }
    }
  }
  return _.map(total);
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
      if (this.cierreIndex == this.totalIndex)
        return this.getTotal(this.current.cierres);
      if (this.current)
        if (this.current.cierres)
          if (this.current.cierres.length >= this.cierreIndex)
            return this.current.cierres[this.cierreIndex - 1].data;
      return [];
    },
    filteredData(state) {
      return this.sortData(
        this.filterData([...this.cierre], state.Total.filter)
      );
    },
    products(state) {
      return _.mapKeys(state.Product.data, function(value, key) {
        return value._id;
      });
    }
  }),
  methods: {
    composeMagnitude: composeMagnitude,
    getTotal(cierres) {
      let total = {};
      let item;

      for (let cierre of cierres) {
        for (let i of cierre.data) {
          item = { ...i };

          if (!total[item._id]) total[item._id] = item;
          else {
            total[item._id].money += item.money;
            total[item._id].amount += item.amount;
          }
        }
      }
      return _.map(total);
    },
    addKeyValues(obj) {
      let values = "";
      for (let val of Object.values(obj)) {
        values += val;
      }
      for (let val of Object.values(this.products[obj._id])) {
        values += val;
      }
      return values.toLowerCase();
    },
    filterData(data, filter) {
      return data.filter(item => {
        return this.addKeyValues(item).includes(filter.toLowerCase());
      });
    },
    sortData(data) {
      return data.sort((a, b) => {
        return parseInt(a._id) - parseInt(b._id);
      });
    }
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
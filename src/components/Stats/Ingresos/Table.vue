<template>
  <div class="grid">
    <Toolbar/>
    <div class="head">
      <div class="column">
        Hora
      </div>
      <div class="column">
        Articulo
      </div>
      <div class="column">
        Cantidad
      </div>
      <div class="column">
        Valor
      </div>
    </div>
    <div class="body">
      <template v-for="log in filteredData">
        <div :key="'row-' + log._id" class="row">
          <div class="column">
            {{toHour(log.time)}}
          </div>
          <div class="column">
            {{products[log.productId].name}}
          </div>
          <div class="column">
            {{composeMagnitude(log.amount, 2)}}
          </div>
          <div class="column">
            ${{products[log.productId].price * toMagnitude(log.amount)}}
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
import { log as types } from "@/vuexTypes";

import { composeMagnitude, toMagnitude, toHour } from "@/Server/mongodb/Utils";

function addKeyValues(obj) {
  let values = "";
  for (let val of Object.values(obj)) {
    values += val;
  }
  return values.toLowerCase();
}
function filterData(data, products, filter) {
  return data.filter(item => {
    return (
      addKeyValues(item) + addKeyValues(products[item.productId])
    ).includes(filter.toLowerCase());
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
      return sortData(
        filterData([...state.Log.ingreso], this.products, this.filter)
      );
    },
    products(state) {
      return _.mapKeys(state.Product.data, function(value, key) {
        return value._id;
      });
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
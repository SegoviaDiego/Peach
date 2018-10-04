<template>
  <div class="mainGrid">
    <HeaderBar
      v-on:go-to="goTo" v-on:print="print"
      :amount="amount" :selected="selected" :changes="changes"
      :newItem="newItem" />
    <Table
      :products="filteredData"
      :amount="amount" :selected="selected" :changes="changes"
      :newItem="newItem" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { products as types } from "@/vuexTypes";

import Print from "@/Server/Src/Print";

import { composeMagnitude } from "@/Server/mongodb/Utils";

import HeaderBar from "./HeaderBar.vue";
import Table from "./Table.vue";

function addKeyValues(obj: any) {
  let values = "";
  for (let val of Object.values(obj)) {
    values += val;
  }
  return values.toLowerCase();
}
function filterData(data: any, filter: any) {
  return data.filter((item: any) => {
    return addKeyValues(item).includes(filter.toLowerCase());
  });
}
function sortData(data: any) {
  return data.sort((a: any, b: any) => {
    return a._id - b._id;
  });
}

export default Vue.extend({
  name: "products-page",
  components: {
    HeaderBar,
    Table
  },
  mounted() {
    this.$store.dispatch(types.load);
  },
  data: () => ({
    newItem: {
      _id: undefined,
      name: null,
      price: null,
      stock: 0
    },
    amount: {},
    outType: undefined,
    selected: {},
    changes: {}
  }),
  computed: mapState({
    data: (state: any) => state.Product.data,
    filteredData(state: any) {
      return sortData(filterData([...state.Product.data], this.filter));
    },
    type: (state: any) => state.Product.type,
    filter: (state: any) => state.Product.filter,
    isLoading: (state: any) => state.Product.loading,
    showSpinner: (state: any) => state.Product.showSpinner,
    route: (state: any) => state.Product.buttonRoute
  }),
  methods: {
    closePrintDialog() {
      this.openPrintDialog = false;
    },
    print() {
      let printData = [];
      printData.push([
        { text: "PLU", style: "tableHeader" },
        { text: "NOMBRE", style: "tableHeader" },
        { text: "EN STOCK", style: "tableHeader" }
      ]);

      for (let item of this.data) {
        printData.push([
          item._id,
          item.name,
          composeMagnitude(item.stock, item.type)
        ]);
      }

      Print.print({
        content: [
          {
            table: {
              headerRows: 1,
              dontBreakRows: true,
              keepWithHeaderRows: 1,
              widths: [50, "*", "20%"],
              body: printData
            }
          }
        ],
        styles: {
          tableHeader: {
            bold: true,
            fontSize: 15,
            color: "black"
          }
        }
      });
    },
    goTo(route: any, from: any) {
      this.$store.dispatch(types.buttons, route);
      if (from)
        switch (from) {
          case types.routes.createItem:
            this.newItem = {
              _id: undefined,
              name: null,
              price: null,
              stock: 0
            };
            break;
          case types.routes.editItems:
            this.changes = {};
            break;
          case types.routes.deleteItems:
            this.selected = {};
            break;
          case types.routes.inStock:
          case types.routes.outStock:
            this.$store.dispatch(types.clearInputs);
            break;
        }
    }
  }
});
</script>

<style lang="scss" scoped>
.mainGrid {
  flex: 1;
  display: grid;
  $v: 25px;
  $h: 30px;
  padding: $v $h;
  grid-row-gap: 20px;
  grid-template-rows: 55px 1fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    "header"
    "table";
  overflow: hidden;
}
</style>
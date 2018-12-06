<template>
  <div class="mainGrid">
    <HeaderBar
      v-on:go-to="goTo"
      v-on:print="print"
      :amount="amount"
      :deleteSelection="deleteSelection"
      :mutatedProducts="mutatedProducts"
      :newItem="newItem"
    />
    <Table
      :products="filteredData"
      :amount="amount"
      :deleteSelection="deleteSelection"
      :mutatedProducts="mutatedProducts"
      :newItem="newItem"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";
import { mapState } from "vuex";
import Print from "@/api/Print";
import { composeMagnitude } from "@/api/Utils";
import { products as types } from "@/vuexTypes";

import Table from "./Table.vue";
import HeaderBar from "./HeaderBar.vue";

function filterData(data: any, filter: any) {
  if (!data || !data.length) {
    return [];
  } else if (!filter) {
    return data;
  } else if (isNaN(filter)) {
    return data.filter((item: any) => {
      return item["name"].toLowerCase().includes(filter.toLowerCase());
    });
  } else {
    return data.filter((item: any) => {
      return parseFloat(item._id) == parseFloat(filter);
    });
  }
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
      _id: null,
      name: "",
      type: 0,
      price: 0,
      stock: 0
    },
    amount: {},
    outType: undefined,
    deleteSelection: {}
  }),
  computed: mapState({
    data: (state: any) => state.Product.data,
    type: (state: any) => state.Product.type,
    isLoading: (state: any) => state.Product.loading,
    showSpinner: (state: any) => state.Product.showSpinner,
    route: (state: any) => state.Product.buttonRoute,
    nextProductId(state: any) {
      let id = 1;
      const item = _.maxBy(_.toArray(state.Product.data), item => {
        return parseInt(item._id);
      });

      if (item) {
        id = parseInt(item._id) + 1;
      }

      return id;
    },
    filteredData(state: any) {
      return filterData([...state.Product.data], state.Product.filter);
    },
    mutatedProducts(state: any) {
      let list = {} as any;

      for (let item of filterData(
        [...state.Product.data],
        state.Product.filter
      )) {
        list[item._id] = {
          ...item
        };
      }

      return _.mapKeys(list, (item: any) => {
        return item._id;
      });
    }
  }),
  methods: {
    closePrintDialog() {
      this.openPrintDialog = false;
    },
    print() {
      let printData = [];
      printData.push([
        { text: "CODIGO", style: "tableHeader" },
        { text: "NOMBRE", style: "tableHeader" },
        { text: "EN STOCK", style: "tableHeader" }
      ]);

      for (let item of this.data) {
        if (item._id != 99998 && item._id != 99999) {
          printData.push([
            item._id,
            item.name,
            composeMagnitude(item.stock, item.type)
          ]);
        }
      }

      Print.print({
        content: [
          {
            table: {
              headerRows: 1,
              dontBreakRows: true,
              keepWithHeaderRows: 1,
              widths: [100, "*", "20%"],
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
      switch (route) {
        case types.routes.createItem:
          this.newItem = {
            _id: this.nextProductId,
            name: "",
            type: 0,
            price: 0,
            stock: 0
          };
          break;
        case types.routes.editItems:
          this.changes = {};
          break;
        case types.routes.deleteItems:
          this.deleteSelection = {};
          break;
        case types.routes.inStock:
        case types.routes.outStock:
          this.$store.dispatch(types.clearInputs);
          break;
        case types.routes.opcionesAvanzadas:
          this.$router.replace("/OpcionesAvanzadas");
          return;
      }
      this.$store.dispatch(types.buttons, route);
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
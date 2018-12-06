<template>
  <div class="sellComponentGrid">
    <HeaderBar/>
    <Table/>
    <Ticket/>
    <SellActions/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { products as types } from "@/vuexTypes";

import Print from "@/api/Print";

import HeaderBar from "./HeaderBar.vue";
import Table from "./Table.vue";
import Ticket from "./Ticket.vue";
import SellActions from "./SellActions.vue";

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
    Table,
    Ticket,
    SellActions
  },
  mounted() {
    this.$store.dispatch(types.load);
  }
});
</script>

<style lang="scss" scoped>
.sellComponentGrid {
  flex: 1;
  display: grid;
  $v: 25px;
  $h: 30px;
  padding: $v $h;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  grid-template-rows: 55px 1fr 1fr 1fr !important;
  grid-template-columns: 2fr 1fr !important;
  grid-template-areas:
    "header header"
    "table ticket"
    "table ticket"
    "table actions";
  overflow: hidden;
}
</style>
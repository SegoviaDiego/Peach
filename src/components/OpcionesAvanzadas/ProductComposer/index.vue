<template>
  <div class="dashgrid">
    <Navbar/>
    <Table :products="filteredData" :selection="selection"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import Navbar from "./navbar.vue";
import Table from "./Table.vue";
import { products as types } from "@/vuexTypes";

function filterData(data: any, filter: any) {
  if (!data || !data.length) {
    return [];
  } else if (!filter) {
    return data;
  } else if (isNaN(filter)) {
    return data.filter((item: any) => {
      return (
        item["name"].toLowerCase().includes(filter.toLowerCase()) &&
        item.composed
      );
    });
  } else {
    return data.filter((item: any) => {
      return parseFloat(item._id) == parseFloat(filter) && item.composed;
    });
  }
}

export default Vue.extend({
  name: "ProductComposer",
  components: {
    Navbar,
    Table
  },
  mounted() {
    this.$store.dispatch(types.load);
  },
  data: () => ({
    selection: {}
  }),
  computed: mapState({
    filteredData(state: any) {
      const data = [...state.Product.data].filter((item: any) => {
        return item.composed;
      });
      return filterData(data, state.Product.filter);
    }
  }),
  methods: {
    goTo(route: any) {
      this.$router.replace({ path: route });
    }
  }
});
</script>

<style lang="scss" scoped>
.dashgrid {
  width: 100%;
  height: 100%;
  flex: 1;
  display: grid;
  grid-row-gap: 20px;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 9fr;
  grid-template-areas: "navbar" "table";
  overflow: hidden;
}
</style>
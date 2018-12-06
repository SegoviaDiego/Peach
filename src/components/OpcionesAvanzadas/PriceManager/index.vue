<template>
  <div class="dashgrid">
    <Navbar :products="filteredData" :selection="selection"/>
    <div class="content">
      <Table :products="filteredData" :selection="selection"/>
    </div>
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
      return item["name"].toLowerCase().includes(filter.toLowerCase());
    });
  } else {
    return data.filter((item: any) => {
      return parseFloat(item._id) == parseFloat(filter);
    });
  }
}

export default Vue.extend({
  name: "PriceManager",
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
      return filterData([...state.Product.data], state.Product.filter);
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
  flex: 1;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 9fr;
  grid-template-areas: "navbar" "content";
  overflow: hidden;
  .content {
    flex: 1;
    grid-area: content;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    .route {
      cursor: pointer;
      flex: 1 1 1;
      width: 30%;
      margin: 0 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #e1e2e1;
      border-radius: 5px;
      .icon {
        @media screen and (max-width: 899px) {
          font-size: 5em;
        }
        @media screen and (min-width: 900px) and (max-width: 999px) {
          font-size: 7em;
        }
        @media screen and (min-width: 1000px) and (max-width: 1299px) {
          font-size: 8em;
        }
        @media screen and (min-width: 1300px) {
          font-size: 10em;
        }
      }
      .label {
        font-family: Lato;
        font-weight: bold;
        font-size: 40px;
      }
    }
  }
}
</style>
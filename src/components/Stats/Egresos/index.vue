<template>
  <div class="indexGrid">
    <Topbar/>
    <Table/>
  </div>
</template>

<script>
import Topbar from "./Topbar.vue";
import Table from "./Table.vue";

export default {
  name: "informes",
  components: {
    Topbar,
    Table
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.indexGrid {
  flex: 1;
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: "topbar" "table";
  overflow: hidden;
  padding: 20px 40px;
}
</style>
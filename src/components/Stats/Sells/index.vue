<template>
  <div class="indexGrid">
    <Table/>
  </div>
</template>

<script>
import Table from "./Table.vue";
import { sell as types } from "@/vuexTypes";
export default {
  name: "informes",
  components: {
    Table
  },
  mounted() {
    this.$store.dispatch(types.setDate, new Date()).then(() => {
      this.$store.dispatch(types.load);
    });
  }
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
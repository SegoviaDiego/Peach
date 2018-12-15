<template>
  <div class="dailySellMain">
    <Table/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Table from "./Table.vue";
import { chart as types } from "@/vuexTypes";

export default {
  name: "DailySell",
  components: {
    Table
  },
  mounted() {
    this.$store.dispatch(types.loadDailySell);
  }
};
</script>

<style lang="scss" scoped>
.dailySellMain {
  position: relative;
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 10px 40px 20px 40px;
}
</style>
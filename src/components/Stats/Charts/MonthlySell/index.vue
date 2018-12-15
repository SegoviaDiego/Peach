<template>
  <div class="monthlySellMain">
    <Table/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Table from "./Table.vue";
import { chart as types } from "@/vuexTypes";

export default {
  name: "MonthlySell",
  components: {
    Table
  },
  mounted() {
    this.$store.dispatch(types.loadMonthlySell);
  }
};
</script>

<style lang="scss" scoped>
.monthlySellMain {
  position: relative;
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 10px 40px 20px 40px;
}
</style>
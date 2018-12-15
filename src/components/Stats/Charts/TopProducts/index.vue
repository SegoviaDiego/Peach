<template>
  <div class="topProductsMain">
    <Table/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Table from "./Table.vue";

export default {
  name: "TopProducts",
  components: {
    Table
  }
};
</script>

<style lang="scss" scoped>
.topProductsMain {
  position: relative;
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 10px 40px 20px 40px;
}
</style>
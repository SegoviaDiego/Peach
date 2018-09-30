<template>
  <div class="indexGrid">
    <Table/>
  </div>
</template>

<script>
import Table from "./Table.vue";

export default {
  name: "informes",
  components: {
    Table
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.indexGrid {
  position: relative;
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 10px 40px 20px 40px;
}
</style>
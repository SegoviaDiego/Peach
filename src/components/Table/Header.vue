<template>
  <div class="header" :style="{gridTemplateColumns: OxyTable.gridTemplate}">
    <template v-for="item in headers">
      <HeaderCell :item="item" :key="item._id" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";
import HeaderCell from "./HeaderCell.vue";

export default Vue.extend({
  name: "Header",
  inject: ["OxyTable"],
  components: {
    HeaderCell
  },
  props: {
    headers: [Array, Object]
  },
});
</script>

<style lang="scss" scoped>
@import "@/global.scss";
.header {
  display: flex;
  align-items: center;
  flex-direction: row;

  margin-right: $scrollbarSize;
  min-height: 50px;

  display: grid;
  grid-area: header;
  grid-template-rows: 1fr;

  z-index: 2;
}
</style>
<template>
  <div class="row" :style="{gridTemplateColumns: OxyTable.gridTemplate}">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";

export default Vue.extend({
  name: "Row",
  inject: ["OxyTable"]
});
</script>

<style lang="scss" scoped>
@import "@/global.scss";
.row {
  min-height: 40px;
  margin: 10px 0px;
  display: grid;
  grid-template-rows: 1fr;
}
</style>
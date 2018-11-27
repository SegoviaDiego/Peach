<template>
  <div class="background">
    <div class="header"/>
    <div class="body" :style="{gridTemplateColumns: OxyTable.gridTemplate}">
      <template v-for="col in OxyTable.cols">
        <div :key="col._id" class="column"/>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Background",
  inject: ["OxyTable"]
});
</script>

<style lang="scss" scoped>
@import "@/global.scss";
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: rgba(225, 226, 225, 0.36);
  color: rgba(225, 226, 225, 0.36);

  display: flex;
  flex-direction: column;
  .header {
    flex: 1;
    min-height: 50px;
    background-color: #e1e2e1;
  }
  .body {
    flex: 9;
    margin-right: $scrollbarSize;

    display: grid;
    grid-template-rows: 1fr;

    .column:nth-of-type(odd) {
      background-color: rgba(225, 226, 225, 0.56);
      color: rgba(225, 226, 225, 0.56);
    }
  }
}
</style>
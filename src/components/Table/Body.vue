<template>
  <div class="body">
    <slot/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Body",
  props: {
    index: Number
  },
  data: () => ({})
});
</script>

<style lang="scss" scoped>
@import "@/global.scss";

.body {
  grid-area: body;
  z-index: 2;
  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: $scrollbarSize;
  }
  &::-webkit-scrollbar-track {
    background-color: #e1e2e1;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #3d3d3d;
  }
}
</style>
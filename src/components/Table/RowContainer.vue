<template>
  <div class="rowContainer">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "RowContainer",
  props: {
    isHeader: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return { isHeader: this.isHeader };
  },
  mounted() {}
});
</script>

<style lang="scss" scoped>
@import "@/global.scss";
.rowContainer {
}
</style>
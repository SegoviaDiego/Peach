<template>
  <div class="asd">
    asdasd
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "stats-navbar"
});
</script>

<style lang="scss" scoped>
.statsGrid {
  flex: 1;
  max-width: 100%;
  max-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: "navtabs" "content";
  overflow: hidden;
  .navtabs {
    grid-area: navtabs;
  }
  .content {
    grid-area: content;
    position: relative;
    display: flex;
    overflow: hidden !important;
  }
}
</style>
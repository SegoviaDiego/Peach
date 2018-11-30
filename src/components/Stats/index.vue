<template>
  <div class="statsGrid">
    <Navbar/>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Navbar from "./navbar";

export default Vue.extend({
  name: "stats-page",
  components: {
    Navbar
  }
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
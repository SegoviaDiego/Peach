<template>
  <div class="statsGrid">
    <div class="navtabs">
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect"
        class="el-menu-demo" >
        <el-menu-item index="1">Informes</el-menu-item>
        <el-menu-item index="2">Movimientos</el-menu-item>
        <el-menu-item index="3">Ingresos</el-menu-item>
        <el-menu-item index="4">Egresos</el-menu-item>
      </el-menu>
    </div>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "stats-page",
  data: () => ({
    activeIndex: "1"
  }),
  methods: {
    handleSelect(index) {
      switch (index) {
        case "1":
          this.$router.replace({ path: "informes" });
          break;
        case "2":
          this.$router.replace({ path: "movimientos" });
          break;
        case "3":
          this.$router.replace({ path: "ingresos" });
          break;
        case "4":
          this.$router.replace({ path: "egresos" });
          break;
        default:
          this.$router.replace({ path: "informes" });
      }
    }
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
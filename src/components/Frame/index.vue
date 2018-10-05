<template>
  <div class="grid">
    <Header class="header" />
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Header from "./header.vue";

export default Vue.extend({
  name: "app-main",
  components: {
    Header
  },
  mounted() {
    this.$router.push("/dashboard");
  }
});
</script>

<style lang="scss" scoped>
.grid {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: 76px 9fr;
  grid-template-columns: 68px 2fr 1fr;
  grid-template-areas:
    "header     header  header"
    "content content content";
  // "navigation content content";
  overflow: hidden;
}
.header {
  grid-area: header;
}
.nav {
  grid-area: navigation;
}
.content {
  grid-area: content;
  position: relative;
  display: flex;
  overflow: hidden !important;
  background-color: white;
}
</style>
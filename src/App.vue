<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Server from "@/Server/Server";

export default Vue.extend({
  name: "home",
  mounted() {
    Server.initServer(this.$store.dispatch).then(() => {
      console.log("Initialized");
    });
  }
});
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}

html {
  overflow: hidden !important;
  button {
    outline: none !important;
  }
}
</style>
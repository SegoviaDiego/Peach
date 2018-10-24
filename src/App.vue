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
    if (process.env.NODE_ENV !== "production") {
      this.$router.replace("/Sells");
    } else {
      this.$router.replace("/Updater");
    }
    Server.initServer(this.$store.dispatch).then(() => {
      console.log("Initialized");
    });
  }
});
</script>

<style lang="scss">
.deleteBox * {
  width: 30px !important;
  height: 30px !important;
}
.el-checkbox__inner::after {
  width: 6px !important;
  height: 15px !important;
  left: 10px !important;
  top: 4px !important;
}
#app {
  font-family: Lato, "Avenir", Helvetica, Arial, sans-serif !important;
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
  body {
    margin: 0;
  }
}
</style>
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
      this.$router.replace("/Updater");
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
* {
  font-family: Lato, "Avenir", Helvetica, Arial, sans-serif;
}

// Dialog style
.el-dialog {
  background: #fff !important;
  width: 50vw !important;
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 15px !important;

  .el-dialog__header {
    font-weight: bold;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    * {
      color: black !important;
    }
    button {
      * {
        font-weight: bold;
        font-size: 20px;
      }
    }
  }
  .el-dialog__footer {
    button {
      height: 55px;
      border: none;
      padding: 15px 20px;
      text-decoration: none;
      text-transform: uppercase;
      border-radius: 40px;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      transition: 300ms;
      color: black;
      &:hover {
        color: #ff5722;
      }
      &.success {
        background-color: #ff7043;
        &:hover {
          color: white;
        }
      }
      &.cancel {
        background-color: #c4c4c4;
      }
    }
  }
}

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
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Client from "@/api/Client/Client";
import { settings as types } from "@/vuexTypes";

export default Vue.extend({
  name: "home",
  mounted() {
    Client.connect().then(() => {
      // Client.parseBackup();
      this.$store.dispatch(types.connect);
    });
    if (process.env.NODE_ENV !== "production") {
      this.$router.replace("/Charts");
    } else {
      this.$router.replace("/Updater");
    }
  }
});
</script>

<style lang="scss">
* {
  font-family: Lato, "Avenir", Helvetica, Arial, sans-serif;
  -webkit-user-select: none;
  user-select: none;
}

// sell's select style
.sellComponentGrid {
  .method {
    .el-select {
      input {
        &::placeholder {
          color: black;
        }
        font-weight: bold;
        border-radius: 50px;
        overflow: hidden;
        @media screen and (max-width: 899px) {
          font-size: 13px;
        }
        @media screen and (min-width: 900px) and (max-width: 999px) {
          font-size: 15px;
        }
        @media screen and (min-width: 1000px) and (max-width: 1299px) {
          font-size: 18px;
        }
        @media screen and (min-width: 1300px) {
          font-size: 20px;
        }
      }
    }
  }
}

// Dialog style
.el-dialog {
  background: #fff;
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 15px;

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
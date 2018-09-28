<template>
  <div class="headerbar">
    <div class="dots">
      <div class="dot">
        :
      </div>
    </div>
    <div class="title">
      <div class="text">
        Peach!
      </div>
    </div>
    <div class="windowtools">
      <button @click="outterFrameUtils(1)">
          <i class="el-icon-minus"></i>
          <!-- <fontawesome icon="window-minimize" /> -->
      </button>
      <button @click="outterFrameUtils(3)">
          <i class="el-icon-close"></i>
          <!-- <fontawesome icon="times" /> -->
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "app-header",
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    outterFrameUtils(type) {
      switch (type) {
        case 1:
          this.$electron.remote.BrowserWindow.getFocusedWindow().minimize();
          break;
        case 3:
          this.$electron.remote.BrowserWindow.getFocusedWindow().close();
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.headerbar {
  background-color: #ff7043;
  display: grid;
  grid-template-rows: 76px;
  grid-template-columns: 53px 5fr 1fr;
  grid-template-areas: "dots title windowtools";
  overflow: hidden;
}
.dots {
  grid-area: dots;
  display: flex;
  justify-content: center;
  align-items: center;
  .dot {
    line-height: 64px;
    font-size: 64px;
    font-weight: bold;
    color: white;
  }
}
.title {
  grid-area: title;
  display: flex;
  height: 100%;
  align-items: center;
  margin: 0;
  .text {
    flex: 1;
    font-size: 42px;
    font-family: Pacifico;
  }
}
.windowtools {
  grid-area: windowtools;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  -webkit-user-select: none;
  user-select: none;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 30px;
    font-weight: bold;
    background: transparent;
    text-decoration: none;
    border: none;
    -webkit-app-region: no-drag;
    transition: 0ms !important;
    cursor: pointer;
    :hover {
      color: black !important;
    }
  }
}
</style>
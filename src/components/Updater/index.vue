<template>
  <div>
    <el-dialog
      :title="title"
      :visible="true"
      lock-scroll
      :show-close="false"
      width="30%">
      <span>
        <el-progress
          :text-inside="true"
          :stroke-width="18"
          :percentage="percentage"
          :status="status" 
          />
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
const electron = require("electron");

export default Vue.extend({
  name: "auto-updater",
  data: () => ({
    title: "Buscando actualizaciones...",
    percentage: 0,
    status: ""
  }),
  mounted() {
    electron.ipcRenderer.on("updates-reply", (event: any, res: any) => {
      switch (res.type) {
        case "downloaded":
          this.status = "success";
          this.title = "Instalando";
          electron.ipcRenderer.send("installUpdates");
          break;
        case "available":
          this.status = "exception";
          this.title = "Descargando actualizacion";
          break;
        case "progress":
          this.percentage = parseInt(res.payload.percent);
          break;
        case "not-available":
        case "error":
        default:
          this.status = "success";
          this.percentage = 100;
          this.title = "Peach! esta actualizado a la ultima version";
          setTimeout(() => {
            this.$router.replace({ path: "dashboard" });
          }, 400);
      }
    });
    electron.ipcRenderer.send("checkForUpdates");
  }
});
</script>

<style lang="scss" scoped>
* {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
  .dialog {
    width: 50vw;
    height: 20vh;
    .content {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .md-progress-bar {
        flex: 1;
        height: 30px;
      }
    }
  }
}
</style>
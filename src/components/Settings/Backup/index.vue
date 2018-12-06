<template>
  <div class="backupGrid">
    <div class="header">
      <button @click="goBack()">Volver atras</button>
      <div class="route">
        <div class="icon">
          <fontawesome icon="hdd"/>
        </div>
        <div class="label">Backup</div>
      </div>
    </div>
    <div class="body">
      <div class="item">
        <el-button @click="exportDb()" type="primary" round>Exportar</el-button>
      </div>
      <div class="item">
        <el-button @click="importDb()" type="primary" round>Importar</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import electron from "electron";
import fs from "fs";
import Client from "@/api/Client/Client";
import socketEvents from "@/socketEvents";

export default Vue.extend({
  name: "Backup",
  methods: {
    goBack() {
      this.$router.replace({ path: "/settings" });
    },
    exportDb() {
      electron.remote.dialog.showSaveDialog(
        {
          title: "Exportar base de datos",
          filters: [
            {
              name: "json",
              extensions: ["json"]
            }
          ]
        },
        async path => {
          if (path) {
            fs.writeFileSync(
              path,
              JSON.stringify(await Client.get(socketEvents.default.export))
            );
          }
        }
      );
    },
    importDb() {
      electron.remote.dialog.showSaveDialog(
        {
          title: "Importar base de datos",
          filters: [
            {
              name: "json",
              extensions: ["json"]
            }
          ]
        },
        async path => {
          if (path) {
            // TODO
            // fs.writeFileSync(path, await Client.get());
          }
        }
      );
    }
  }
});
</script>

<style lang="scss" scoped>
.backupGrid {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .header {
    height: 100px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: calc(10% - 60px);
    justify-content: flex-start;
    .route {
      margin-right: calc(130px + calc(10% - 60px));
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .icon {
        font-size: 30px;
      }
      .label {
        font-family: Lato;
        font-weight: bold;
        font-size: 30px;
        margin: 0 20px;
      }
    }
    button {
      color: black;
      background-color: #fdd835;
      height: 55px;
      min-width: 130px;
      border: none;
      padding: 15px 20px;
      text-decoration: none;
      text-transform: uppercase;
      border-radius: 40px;
      font-family: Lato;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      transition: 300ms;
      &:hover {
        color: #ff5722;
      }
    }
  }
  .body {
    flex: 1;
    width: 80%;
    padding: 30px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    background-color: #e1e2e1;
    overflow: hidden;
  }
}
</style>
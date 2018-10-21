<template>
  <div class="settingsGrid">
    <div class="header">
      <button @click="goBack()">
        Volver atras
      </button>
    </div>
    <div class="body">
      <template v-if="!loggedIn">

        <div class="loginForm">
          <el-input placeholder="Usuario" v-model="user"/>
          <el-input placeholder="Password" type="password" v-model="pass"/>
          <el-button @click="logIn()" type="primary" round>Ingresar</el-button>
        </div>

      </template>
      <template v-else>
        <div @click="goTo(1)" class="route">
          <div class="icon">
            <fontawesome icon="sliders-h" />
          </div>
          <div class="label">
            Preferencias
          </div>
        </div>
        <div @click="goTo(2)" class="route">
          <div class="icon">
            <fontawesome icon="users" />
          </div>
          <div class="label">
            Usuarios
          </div>
        </div>
        <div @click="goTo(3)" class="route">
          <div class="icon">
            <fontawesome icon="database" />
          </div>
          <div class="label">
            Base de datos
          </div>
        </div>
        <div @click="goTo(4)" class="route">
          <div class="icon">
            <fontawesome icon="server" />
          </div>
          <div class="label">
            Cloud
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "app-settings",
  data: () => ({
    loggedIn: process.env.NODE_ENV !== "production",
    user: "",
    pass: ""
  }),
  methods: {
    logIn() {
      if (this.user === "admin" && this.pass === "1128") {
        this.loggedIn = true;
      }
    },
    goBack() {
      this.$router.replace({ path: "/dashboard" });
    },
    goTo(id: number) {
      switch (id) {
        case 1:
          this.$router.replace({ path: "/preferences" });
          break;
        case 2:
          this.$router.replace({ path: "/users" });
          break;
        case 3:
          this.$router.replace({ path: "/database" });
          break;
        case 4:
          this.$router.replace({ path: "/cloud" });
          break;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.settingsGrid {
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
    justify-content: flex-start;
    margin-left: calc(10% - 60px);
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
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    .loginForm {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .route {
      cursor: pointer;
      flex: 1 1 1;
      width: 30%;
      margin: 0 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #e1e2e1;
      border-radius: 5px;
      .icon {
        font-size: 14em;
      }
      .label {
        font-family: Lato;
        font-weight: bold;
        font-size: 40px;
      }
    }
  }
}
</style>
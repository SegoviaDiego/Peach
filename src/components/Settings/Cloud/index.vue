<template>
  <div class="cloudGrid">
    <div class="header">
      <button @click="goBack()">
        Volver atras
      </button>
      <div class="route">
        <div class="icon">
          <fontawesome icon="server" />
        </div>
        <div class="label">
          Cloud
        </div>
      </div>
    </div>
    <div class="body">
      <div class="container" v-loading="isLoading">
        <template v-if="!loggedIn">
          <div class="loginForm">
            <el-input placeholder="Usuario" v-model="email"/>
            <el-input placeholder="Password" type="password" v-model="pass"/>
            <el-button @click="logIn()" type="primary" round>Ingresar</el-button>
          </div>
        </template>
        <template v-else>
          <div class="selectHeader">
            <el-select v-model="instance" placeholder="Seleccionar instancia">
              <template v-for="item of instances">
                <el-option
                  :key="item._id"
                  :label="item.name"
                  :value="item._id">
                </el-option>
              </template>
            </el-select>
          </div>
          <template v-if="instance">
            <div class="settings" v-if="false">
              <template v-for="(preference, i) in pList">
                <div :key="preference + i" class="preference">
                  <div class="label">
                    {{pNames[i]}}:
                  </div>
                  <div class="switch">
                    <el-switch
                      v-model="data[preference]"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                  </div>
                </div>
              </template>
            </div>
            <button class="bottomBtn" @click="save()">
              Guardar
            </button>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { settings as types } from "@/vuexTypes";
import * as path from "path";
import Firebase from "@/api/Server/db/Firebase";
import Settings from "@/api/Server/Settings";

export default Vue.extend({
  name: "app-settings",
  mounted() {
    this.$store.dispatch(types.loadCloud).then(() => {
      this.data = { ...this.cloud };
    });
  },
  data: () => ({
    loggedIn: false,
    email: "",
    pass: "",
    instance: {} as any,
    instances: {} as any,
    data: {} as any,
    pList: ["synAll"] as any,
    pNames: ["Sincronizar todo"] as any
  }),
  computed: mapState({
    isLoading: (state: any) => state.Settings.loading,
    cloud: (state: any) => state.Settings.cloud
  }),
  methods: {
    logIn() {
      this.$store.dispatch(types.startLoading);
      Firebase.auth().then(auth => {
        auth
          .signInWithEmailAndPassword(this.email, this.pass)
          .then(value => {
            Firebase.getInstances().then((instances: any) => {
              if (instances) {
                this.instances = instances;
                this.loggedIn = true;
              }
              this.$store.dispatch(types.stopLoading);
            });
          })
          .catch(err => {
            throw err;
          });
      });
    },
    goBack() {
      this.$router.replace({ path: "/settings" });
    },
    save() {
      this.$store
        .dispatch(types.saveCloud, {
          instance: this.instance,
          email: this.email,
          pass: this.pass
        })
        .then(() => {
          this.$notify({
            title: "Se han guardado las preferencias con exito.",
            message: "",
            type: "success",
            duration: 5000,
            offset: 70
          });
        });
      // Firebase.saveInstancePreference({
      //   _id: this.instance,
      //   data: this.data
      // }).then(() => {

      // });
    }
  }
});
</script>

<style lang="scss" scoped>
.cloudGrid {
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
    justify-content: center;
    .container {
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
      width: 100%;
      background-color: #e1e2e1;
      overflow: hidden;
      .loginForm {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .selectHeader {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
      }
      .settings {
        flex: 1;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        margin-bottom: 65px;
        padding: 10px;
        overflow: hidden;
        .preference {
          flex: 1 1 1;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          margin-bottom: 4px;
          .label {
            font-family: Lato;
            font-weight: bold;
            font-size: 16px;
            margin-right: 10px;
            text-transform: uppercase;
          }
        }
      }
      .bottomBtn {
        position: absolute;
        bottom: 10px;
        right: 10px;
        color: black;
        background-color: #ff7043;
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
      }
    }
  }
}
</style>
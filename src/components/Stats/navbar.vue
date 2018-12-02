<template>
  <div class="statsNavbarFlex">
    <div class="container" :class="{informe: selectedRoute == routes.informes ? true : false}">
      <div class="selectors">
        <el-dropdown trigger="click" @command="setRoute">
          <span class="selector">
            {{getPositionLabel(selectedRoute)}}
            <fontawesome icon="chevron-circle-down"/>
          </span>
          <el-dropdown-menu slot="dropdown" class="select">
            <template v-for="route of routes">
              <el-dropdown-item
                :key="route"
                :command="route"
                :class="{'active': selectedRoute == route}"
              >{{getPositionLabel(route)}}</el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>

        <template v-if="selectedRoute == routes.informes && date">
          <!-- Cierre selection -->
          <el-dropdown trigger="click" @command="setCierreIndex">
            <span class="selector">
              {{getCierreLabel(cierreIndex)}}
              <fontawesome icon="chevron-circle-down"/>
            </span>
            <el-dropdown-menu slot="dropdown" class="select">
              <template v-for="i of cierres.length">
                <el-dropdown-item
                  :key="'cierre-'+i"
                  :command="i"
                  :class="{'active': i == cierreIndex }"
                >
                  <span style="float: left">{{getCierreLabel(i)}}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ getHourRange(i) }}</span>
                </el-dropdown-item>
              </template>
              <!-- Total -->
              <el-dropdown-item
                :key="'cierre-'+totalIndex"
                :command="totalIndex"
                :class="{ 'active': cierreIndex == totalIndex }"
              >
                <span style="float: left">Total</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <!-- Crear un cierre manualmente -->
          <template v-if="equalDates(new Date(), date)">
            <button
              v-loading="cierreLoading"
              :disabled="cierreLoading"
              @click="makeCierre"
            >Crear cierre</button>
          </template>
        </template>
      </div>
      <div class="buttons">
        <!-- Go back button -->
        <button @click="goBack">Volver atras</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import Client from "@/api/Client/Client";
import { equalDates, toHour, toHumanDate } from "@/api/Utils";
import { totals as totalTypes, settings as types } from "@/vuexTypes";
import socketEvents from "@/socketEvents";

export default Vue.extend({
  name: "stats-navbar",
  computed: mapState({
    isLoading: state => state.Total.loading,
    date: state => state.Total.date,
    cierreIndex: state => state.Total.cierreIndex,
    selectedRoute: state => state.Settings.statsSelectedRoute,
    cierres(state) {
      if (state.Total.data && state.Total.data.cierresData) {
        return state.Total.data.cierresData;
      }
      return [];
    }
  }),
  data: () => ({
    routes: {
      informes: "/informes",
      movs: "/movimientos",
      ingreso: "/ingresos",
      egreso: "/egresos",
      sells: "/Sells"
    },
    totalIndex: totalTypes.totalIndex,
    cierreLoading: false
  }),
  methods: {
    equalDates: equalDates,
    makeCierre() {
      if (this.cierreLoading) return;
      this.cierreLoading = true;
      Client.set(socketEvents.Total.makeCierre)
        .then(async created => {
          if (created) {
            const index = this.cierreIndex;
            await this.$store.dispatch(totalTypes.load);
            await this.setCierreIndex(index);

            this.$notify({
              title: "Cierre creado",
              message: "",
              type: "success",
              duration: 3000,
              offset: 170
            });
          } else {
            // this.$notify({
            //   title: "No se puede crear un cierre si el turno esta vacio",
            //   message: "",
            //   type: "warning",
            //   duration: 3000,
            //   offset: 170
            // });
          }
          this.cierreLoading = false;
        })
        .catch(systel => {
          if (systel) {
            this.$notify({
              title: "Ha ocurrido un error al crear el cierre",
              message:
                "Antes de realizar el cierre debes cerrar el programa Qendra",
              type: "warning",
              duration: 5000,
              offset: 70
            });
          }
        });
    },
    goBack() {
      this.$router.replace({ path: "/dashboard" });
      this.$store.dispatch(types.setStatsRoute, null);
    },
    setRoute(route) {
      this.$router.replace({ path: route });
      this.$store.dispatch(types.setStatsRoute, route);
    },
    getPositionLabel(route) {
      switch (route) {
        case this.routes.informes:
          return "Informes";
        case this.routes.movs:
          return "Movimientos";
        case this.routes.ingreso:
          return "Ingresos";
        case this.routes.egreso:
          return "Egresos";
        case this.routes.sells:
          return "Ventas";
        default:
          return "Seleccionar categoria";
      }
    },
    setCierreIndex(index) {
      this.$store.dispatch(totalTypes.setCierreIndex, index);
    },
    getCierreLabel(i) {
      if (!i) return "Seleccionar cierre";
      if (i == this.totalIndex) return "Total";
      if (this.cierres.length == i && equalDates(new Date(), this.date))
        return "Turno actual";
      return "Cierre " + i;
    },
    getHourRange(i) {
      return (
        toHour(new Date(this.cierres[i - 1].start)) +
        " - " +
        toHour(new Date(this.cierres[i - 1].end || new Date()))
      );
    }
  }
});
</script>

<style lang="scss" scoped>
.select {
  * {
    font-family: Lato;
    font-size: 20px;
    font-weight: bold;
  }
  *.active {
    background-color: #ecf5ff;
    color: #66b1ff;
  }
}
.statsNavbarFlex {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100px;
  padding: 0 40px;
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    &.informe {
      @media screen and (max-width: 899px) {
        * {
          font-size: 18px !important;
        }
      }
      @media screen and (min-width: 1000px) and (max-width: 1299px) {
        * {
          font-size: 17px !important;
        }
      }
      @media screen and (min-width: 1000px) {
        width: 75% !important;
      }
    }
    .selectors {
      flex: 3;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      button {
        background-color: #e1e2e1;
      }
      .selector {
        margin-right: 10px;
        height: 55px;
        min-width: 130px;
        color: black;
        background-color: #e1e2e1;
        border: none;
        outline: none;
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
    .buttons {
      flex: 1;
      min-width: 130px;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      font-size: 28px;
      @media screen and (max-width: 899px) {
        * {
          font-size: 18px;
        }
      }
    }
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
</style>
<template>
  <div class="grid">
    <template v-if="cierreIndex">
      <template v-if="exists">
        <div class="info">
          <div class="date">
            {{getDate()}}
          </div>
          <div class="total">
            <template v-if="cierreIndex && current">
              <template v-if="cierreIndex == totalIndex">
                Total: $ {{current.total.toFixed(2)}}
              </template>
              <template v-else>
                Total en {{getName()}}: $ {{current.cierres[cierreIndex - 1].total}}
              </template>
            </template>
          </div>
          <div class="comparison">
            <!-- $2393 <span style="color: green;">más</span> que ayer. -->
          </div>
        </div>
        <div v-if="false" class="buttons">
          <div class="circle">
            <div class="icon">
              <fontawesome icon="search" />
            </div>
            <div class="title">
              Detalle
            </div>
          </div>
          <div class="circle">
            <div class="icon">
              <fontawesome icon="search" />
            </div>
            <div class="title">
              Grafico
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { equalDates } from "@/Server/mongodb/Utils";
import { totals as types } from "@/vuexTypes";

import Vue from "vue";
import { mapState } from "vuex";
export default Vue.extend({
  name: "informes-sidebar",
  data: () => ({
    totalIndex: types.totalIndex
  }),
  computed: mapState({
    exists: state => state.Total.exists,
    date: state => state.Total.date,
    isLoading: state => state.Total.loading,
    current: state => state.Total.data,
    cierreIndex: state => state.Total.cierreIndex,
    cierres(state) {
      if (state.Total.data) {
        return state.Total.data.cierres.length;
      }
      return 0;
    }
  }),
  methods: {
    getName() {
      if (this.cierreIndex == this.cierres && equalDates(new Date(), this.date))
        return "Turno Actual";
      return "Cierre " + this.cierreIndex;
    },
    getDate() {
      let date = "";
      let time = "";

      if (equalDates(new Date(), this.date)) {
        date = "Hoy";
      } else {
        date = `
          ${this.date.getDate()}/
          ${this.date.getMonth()}/
          ${this.date.getFullYear()}`;
      }

      if (this.cierreIndex == this.totalIndex) {
        return date;
      } else {
        if (
          this.cierreIndex == this.cierres &&
          equalDates(new Date(), this.date)
        ) {
          time = `Turno actual`;
          return time;
        } else {
          time = `
          ${this.current.cierres[this.cierreIndex - 1].date.getHours()}:
          ${this.current.cierres[this.cierreIndex - 1].date.getMinutes()}`;
        }
        return date + " a las " + time;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.grid {
  grid-area: sidebar;
  display: grid;
  grid-template-rows: 1fr 2fr;
  grid-template-columns: 1fr;
  grid-template-areas: "info" "buttons";
  overflow: hidden;
  .info {
    grid-area: info;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    * {
      color: #000;
      font-size: 24px;
      font-weight: bold;
      font-family: Lato;
      margin-bottom: 10px;
    }
  }
  .buttons {
    grid-area: buttons;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    .circle {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      $circleSize: 10vw;
      width: $circleSize;
      height: $circleSize;
      border-radius: 50%;
      background-color: #ff7043;
      color: #fff;
      font-size: 24px;
      // font-weight: bold;
      font-family: Lato;
      margin-bottom: 20px;
      cursor: pointer;
    }
  }
}
</style>
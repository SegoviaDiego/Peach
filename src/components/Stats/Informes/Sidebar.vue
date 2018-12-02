<template>
  <div class="grid">
    <template v-if="cierreIndex">
      <template v-if="exists">
        <div class="info">
          <div class="date">{{getDate()}}</div>
          <div class="date">{{getTimePeriod()}}</div>
          <div class="total">
            <template v-if="cierreIndex && totalDelDia">
              <OxyTable v-model="sidebarData">
                <Row slot="row" slot-scope="item">
                  <Cell label="Desc" :colSpan="1">{{item.title}}</Cell>
                  <Cell label="Monto" :colSpan="1">$ {{item.value}}</Cell>
                </Row>
              </OxyTable>
            </template>
          </div>
          <div class="comparison">
            <!-- $2393 <span style="color: green;">más</span> que ayer. -->
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import { equalDates, toHour } from "@/api/Utils";
import { totals as types } from "@/vuexTypes";

import OxyTable from "@/components/Table/index.vue";
import Row from "@/components/Table/Row.vue";
import Cell from "@/components/Table/Cell.vue";

export default Vue.extend({
  name: "informes-sidebar",
  components: {
    OxyTable,
    Row,
    Cell
  },
  data: () => ({
    totalIndex: types.totalIndex
  }),
  computed: mapState({
    exists: state => state.Total.exists,
    date: state => state.Total.date,
    movements: state => state.Log.mov,
    isLoading: state => state.Total.loading,
    totalDelDia: state => state.Total.data,
    cierreIndex: state => state.Total.cierreIndex,
    cantidadDeCierres(state) {
      if (state.Total.data) {
        return state.Total.data.cierres.length;
      }
      return 0;
    },
    sidebarData(state) {
      const data = [];
      let cierre;
      let start, end;
      let total = 0;

      if (this.cierreIndex == this.totalIndex) {
        cierre = this.totalDelDia;
        start = new Date(cierre.day);
        start.setHours(0, 0, 0, 0);
        end = new Date(cierre.day);
        end.setHours(24, 0, 0, 0);
      } else {
        cierre = this.totalDelDia.cierresData[this.cierreIndex - 1];
        start = new Date(cierre.start);
        end = new Date(cierre.end || new Date());
      }

      data.push({
        title: "Ventas",
        value: parseFloat(cierre.subTotal || cierre.total).toFixed(2)
      });
      total += parseFloat(cierre.subTotal || cierre.total);

      if (cierre.payDivision && cierre.payDivision.recargo) {
        data.push({
          title: "Recargos",
          value: parseFloat(cierre.payDivision.recargo).toFixed(2)
        });
        total += parseFloat(cierre.payDivision.recargo);
      }
      data.push({
        title: "Ingresos",
        value: this.getIngresos(start, end)
      });
      data.push({
        title: "Egresos",
        value: this.getEgresos(start, end)
      });

      total += this.getIngresos(start, end) - this.getEgresos(start, end);

      data.push({
        title: "Total",
        value: total.toFixed(2)
      });
      return data;
    }
  }),
  methods: {
    getIngresos(start, end) {
      let total = 0;
      const movs = _.toArray(
        _.pickBy(this.movements, item => {
          return (
            item.type == 1 &&
            new Date(item.time) >= start &&
            new Date(item.time) <= end
          );
        })
      );

      for (const mov of movs) {
        total += mov.money;
      }

      return total;
    },
    getEgresos(start, end) {
      let total = 0;
      const movs = _.toArray(
        _.pickBy(this.movements, item => {
          return (
            item.type == 2 &&
            new Date(item.time) >= start &&
            new Date(item.time) <= end
          );
        })
      );

      for (const mov of movs) {
        total += mov.money;
      }

      return total;
    },
    getName() {
      if (
        this.cierreIndex == this.cantidadDeCierres &&
        equalDates(new Date(), this.date)
      )
        return "Turno Actual";
      return "Cierre " + this.cierreIndex;
    },
    getDate() {
      if (equalDates(new Date(), this.date)) return "Hoy";

      return `
          ${this.date.getDate()}/
          ${this.date.getMonth()}/
          ${this.date.getFullYear()}`;
    },
    getTimePeriod() {
      if (this.cierreIndex == this.totalIndex) return;

      if (
        this.cierreIndex == this.cantidadDeCierres &&
        equalDates(new Date(), this.date)
      ) {
        return "Turno actual";
      }

      return (
        toHour(
          new Date(this.totalDelDia.cierresData[this.cierreIndex - 1].start)
        ) +
        " - " +
        toHour(new Date(this.totalDelDia.cierresData[this.cierreIndex - 1].end))
      );
    }
  }
});
</script>

<style lang="scss" scoped>
.grid {
  grid-area: sidebar;
  display: grid;
  grid-template-rows: 2fr 1fr;
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
      font-weight: bold;
      font-family: Lato;
      margin-bottom: 10px;
      font-size: 24px;
      @media screen and (max-width: 899px) {
        font-size: 20px;
      }
      @media screen and (min-width: 900px) and (max-width: 999px) {
        font-size: 20px;
      }
      @media screen and (min-width: 1000px) and (max-width: 1299px) {
        font-size: 25px;
      }
      @media screen and (min-width: 1300px) {
        font-size: 28px;
      }
    }
    .total {
      display: flex;
      .body * {
        @media screen and (max-width: 899px) {
          font-size: 18px;
          margin: 0 1px;
        }
        @media screen and (min-width: 900px) and (max-width: 999px) {
          font-size: 20px;
          margin: 0 1px;
        }
        @media screen and (min-width: 1000px) and (max-width: 1299px) {
          font-size: 20px;
          margin: 0 3px;
        }
        @media screen and (min-width: 1300px) {
          font-size: 23px;
          margin: 0 3px;
        }
      }
    }
  }
}
</style>
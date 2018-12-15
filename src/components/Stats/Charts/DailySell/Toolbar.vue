<template>
  <div class="toolbarFlex">
    <div class="date">
      <div class="from">{{getDate(1)}}</div>
      <div class="to">{{getDate(2)}}</div>
    </div>
    <div class="searchbar">
      <input
        :value="filter"
        @input="filterChanged($event.target.value)"
        placeholder="Buscar"
        type="text"
      >
    </div>
    <button @click="selectingDate = true" class="rect">Fecha</button>
    <button @click="selectingPrint = true" class="circle">
      <fontawesome icon="print"/>
    </button>

    <!-- Dialog -->
    <el-dialog title="Seleccionar fecha" :visible.sync="selectingDate" width="50%">
      <div class="dialogBody">
        <el-date-picker
          v-model="selectedDate"
          format="dd/MM/yyyy HH:mm:ss"
          :picker-options="datePickOptions"
          type="datetimerange"
          start-placeholder="Desde"
          range-separator="|"
          end-placeholder="Hasta"
          align="right"
          :default-time="['00:00:00', '23:59:59']"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectingDate = false">Cancelar</el-button>
        <el-button type="primary" @click="setDate()">Aceptar</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Imprimir ventas diarias" :visible.sync="selectingPrint" width="30%">
      <div class="dialogBody"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectingPrint = false">Cancelar</el-button>
        <el-button type="primary" @click="validatePrint()">Imprimir</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import { chart as types } from "@/vuexTypes";
import Print from "@/api/Print";
import { equalDates, toHour } from "@/api/Utils";

export default Vue.extend({
  name: "informes-toolbar",
  components: {},
  mounted() {},
  computed: mapState({
    isLoading: state => state.Chart.loading,
    filter: state => state.Chart.filter,
    data: state => state.Chart.dailySell,
    range: state => ({
      start: state.Chart.start,
      end: state.Chart.end
    })
  }),
  data: () => ({
    selectingDate: false,
    selectingPrint: false,
    selectedDate: null,
    selectedTime: null,
    selectedPrint: null,
    datePickOptions: {
      disabledDate(time) {
        const limit = new Date();
        limit.setDate(limit.getDate() + 1);
        limit.setHours(0, 0, 0, 0);
        return time >= limit;
      },
      shortcuts: [
        {
          text: "Esta semana",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "Este mes",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit("pick", date);
          }
        },
        {
          text: "Este año",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", date);
          }
        }
      ]
    }
  }),
  methods: {
    filterChanged(value) {
      this.$store.dispatch(types.filter, value);
    },
    getDate(type) {
      if (equalDates(this.range.start, this.range.end)) {
        if (type === 1) return "Fecha sin seleccionar";
        return;
      }
      if (type === 1) {
        return (
          this.range.start.getDate() +
          "/" +
          this.range.start.getMonth() +
          "/" +
          this.range.start.getFullYear() +
          " - " +
          toHour(this.range.start)
        );
      } else {
        return (
          this.range.end.getDate() +
          "/" +
          this.range.end.getMonth() +
          "/" +
          this.range.end.getFullYear() +
          " - " +
          toHour(this.range.end)
        );
      }
    },
    setDate() {
      this.$store
        .dispatch(types.setDate, {
          start: this.selectedDate[0],
          end: this.selectedDate[1]
        })
        .then(() => {
          this.$store.dispatch(types.loadDailySell);
          this.selectingDate = false;
        });
    },
    validatePrint() {
      this.print();
      // if (!this.selectedTime) {
      //   this.$notify({
      //     title: "No seleccionaste un rango horario!",
      //     message: "No has colocado ningun valor.",
      //     type: "warning",
      //     duration: 5000,
      //     offset: 170
      //   });
      // } else {
      // }
    },
    print() {
      const res = [];

      res.push([
        { text: "Dia", style: "tableHeader" },
        { text: "Venta", style: "tableHeader" }
      ]);

      for (const el of _.toArray(this.data)) {
        res.push([
          { text: el.name },
          {
            text: el.money.toFixed(2)
          }
        ]);
      }

      Print.print({
        content: [
          {
            table: {
              headerRows: 1,
              dontBreakRows: true,
              keepWithHeaderRows: 1,
              widths: ["*", "20%"],
              body: res
            }
          }
        ],
        styles: {
          tableHeader: {
            bold: true,
            fontSize: 15,
            color: "black"
          }
        }
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.datePicker {
  background: red !important;
}
.dialogBody {
  display: flex;
  justify-content: center;
  align-items: center;
}
.dateDialog {
  overflow: visible;
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: visible;
  }
}
.toolbarFlex {
  grid-area: toolbar;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  border-bottom: 2px solid #959595;
  .date {
    padding-left: 10px;
    grid-area: date;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    font-family: Lato;
    font-weight: bold;
    font-size: 26px;
    color: #000;
  }
  .searchbar {
    margin: 0px 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    input {
      border: none;
      outline: none;
      background-color: #e1e2e1;
      color: #000;
      font-family: Lato;
      // font-weight: 300;
      font-size: 20px;
      border-radius: 20px;
      padding: 5px 20px;
      width: 250px;
    }
  }
  button {
    margin-right: 10px;
    background-color: #fdd835;
    border: none;
    text-decoration: none;
    text-transform: capitalize;
    font-family: Lato;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: 300ms;
    &:hover {
      color: #ff5722;
    }
    &.rect {
      height: 40px;
      width: 100px;
    }
    &.circle {
      $circleSize: 40px;
      height: $circleSize;
      width: $circleSize;
      border-radius: 50%;
      font-size: 18px;
    }
  }
}
</style>
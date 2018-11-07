<template>
  <div class="toolbarFlex">
    <div class="date">
      {{getDate()}}
    </div>
    <div class="searchbar">
      <input
        :value="filter"
        @input="filterChanged($event.target.value)"
        placeholder="Buscar" type="text">
    </div>
    <button @click="selectingDate = true" class="rect">
      Fecha
    </button>
    <button @click="selectingPrint = true" class="circle">
      <fontawesome icon="print" />
    </button>
    
    <!-- Dialog -->
    <el-dialog
      title="Seleccionar fecha"
      :visible.sync="selectingDate"
      width="30%">
      <div>
        <el-date-picker
          v-model="selectedDate"
          format="dd/MM/yyyy"
          type="date"
          placeholder="Seleccionar dia"
          :picker-options="datePickOptions">
        </el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectingDate = false">Cancelar</el-button>
        <el-button type="primary" @click="setDate()">Aceptar</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Seleccionar rango horario para la impresion"
      :visible.sync="selectingPrint"
      width="30%">
      <div>
        <el-select multiple v-model="selectedCierre"  placeholder="Seleccionar cierre">
           <template v-for="i of cierres.length">
            <el-option
              :key="'cierre-'+i"
              :label="getLabel(i)"
              :value="i">
              <span style="float: left">{{ getLabel(i) }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ getHourRange(i) }}</span>
            </el-option>
          </template>
          <el-option :value="0" label="Todos" />
        </el-select>
      </div>
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
import { log as types, totals as totalTypes } from "@/vuexTypes";
import Print from "@/Server/Src/Print";
import {
  composeMagnitude,
  toHour,
  equalDates,
  toHumanDate
} from "@/Server/mongodb/Utils";

export default Vue.extend({
  name: "informes-toolbar",
  components: {},
  mounted() {},
  computed: mapState({
    preferences: state => state.Settings.preferences,
    movements: state => state.Log.mov,
    exists: state => state.Total.exists,
    filter: state => state.Total.filter,
    isLoading: state => state.Total.loading,
    cierreIndex: state => state.Total.cierreIndex,
    date: state => state.Total.date,
    cierres(state) {
      if (state.Total.data) return state.Total.data.cierres;
      return [];
    }
  }),
  data: () => ({
    totalIndex: totalTypes.totalIndex,
    selectingDate: false,
    selectingPrint: false,
    selectedDate: null,
    selectedCierre: [],
    datePickOptions: {
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      shortcuts: [
        {
          text: "Hoy",
          onClick(picker) {
            picker.$emit("pick", new Date());
          }
        },
        {
          text: "Ayer",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit("pick", date);
          }
        },
        {
          text: "Semana pasada",
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
    getHourRange(i) {
      if (this.cierres.length == i && equalDates(new Date(), this.date)) {
        return `${toHour(this.cierres[i - 1].start)} - ${toHour(new Date())}`;
      }
      return `${toHour(this.cierres[i - 1].start)} - ${toHour(
        this.cierres[i - 1].end
      )}`;
    },
    getLabel(i) {
      if (this.cierres.length == i && equalDates(new Date(), this.date))
        return "Turno actual";
      return "Cierre " + i;
    },
    filterChanged(value) {
      this.$store.dispatch(totalTypes.filter, value);
    },
    setIndex(index) {
      this.$store.dispatch(totalTypes.setCierreIndex, index);
    },
    getDate() {
      let now = new Date();
      if (
        now.getDate() == this.date.getDate() &&
        now.getMonth() == this.date.getMonth() &&
        now.getFullYear() == this.date.getFullYear()
      ) {
        return "Hoy";
      }

      return `${this.date.getDate()}/${this.date.getMonth()}/${this.date.getFullYear()}`;
    },
    setDate() {
      this.$store.dispatch(totalTypes.setDate, this.selectedDate).then(() => {
        this.$store.dispatch(totalTypes.load);
        this.$store.dispatch(types.loadIngreso);
        this.$store.dispatch(types.loadEgreso);
        this.$store.dispatch(types.loadMov);
        this.selectingDate = false;
      });
    },
    getTotal(cierres) {
      let res = {};
      let total;

      for (let cierre of cierres) {
        for (let i of cierre.data) {
          total = { ...i };

          if (!res[total.item._id]) {
            res[total.item._id] = total;
          } else {
            res[total.item._id].money += total.money;
            res[total.item._id].amount += total.amount;
          }
        }
      }

      return _.map(res);
    },
    validatePrint() {
      if (!this.selectedCierre || this.selectedCierre.length == 0) {
        this.$notify({
          title: "No seleccionaste un cierre!",
          message: "Selecciona un cierre para poder imprimir.",
          type: "warning",
          duration: 5000,
          offset: 170
        });
      } else {
        this.print();
      }
    },
    getPrintCierres() {
      if (_.includes(this.selectedCierre, 0)) {
        return this.cierres;
      }
      let cierres = [];
      for (let i in this.cierres) {
        if (_.includes(this.selectedCierre, parseInt(i) + 1))
          cierres.push(this.cierres[i]);
      }
      return cierres;
    },
    getIngresos(start, end) {
      return _.toArray(
        _.pickBy(this.movements, item => {
          return item.type == 1 && item.time >= start && item.time <= end;
        })
      );
    },
    getEgresos(start, end) {
      return _.toArray(
        _.pickBy(this.movements, item => {
          return item.type == 2 && item.time >= start && item.time <= end;
        })
      );
    },
    print() {
      let cierres = this.getPrintCierres();

      let titleHeader,
        cierresTotales,
        ingresos,
        egresos,
        ventas,
        resumen,
        totalCierres,
        totalEgresos,
        totalIngresos,
        totalRecargo;

      const title = `INFORME ${
        this.preferences["appName"] ? `: ${this.preferences["appName"]}` : ""
      }`;

      titleHeader = [
        [{ text: title, style: "title" }],
        [{ text: toHumanDate(this.date), style: "title" }]
      ];

      cierresTotales = [
        [{ text: "CIERRES", style: "title", colSpan: 4 }, {}, {}, {}],
        [
          { text: "DESCRIPCION", style: "title", rowSpan: 2 },
          { text: "HORA", style: "title", colSpan: 2 },
          {},
          { text: "IMPORTE $", style: "title", rowSpan: 2 }
        ],
        [
          {},
          { text: "INICIO", style: "title" },
          { text: "CIERRE", style: "title" },
          {}
        ]
      ];

      ingresos = [
        [{ text: "INGRESOS", style: "title", colSpan: 3 }, {}, {}],
        [
          { text: "DESCRIPCION", style: "tableHeader" },
          { text: "HORA", style: "tableHeader" },
          { text: "IMPORTE $", style: "tableHeader" }
        ]
      ];

      egresos = [
        [{ text: "EGRESOS", style: "title", colSpan: 3 }, {}, {}],
        [
          { text: "DESCRIPCION", style: "tableHeader" },
          { text: "HORA", style: "tableHeader" },
          { text: "IMPORTE $", style: "tableHeader" }
        ]
      ];

      ventas = [
        [{ text: "PRODUCTOS VENDIDOS", style: "title", colSpan: 3 }, {}, {}],
        [
          { text: "NOMBRE", style: "tableHeader" },
          { text: "CANTIDAD", style: "tableHeader" },
          { text: "IMPORTE $", style: "tableHeader" }
        ]
      ];

      resumen = [[{ text: "RESUMEN", style: "title", colSpan: 2 }, {}]];

      totalCierres = 0;
      totalIngresos = 0;
      totalEgresos = 0;
      totalRecargo = 0;

      for (let i in cierres) {
        // Cierres

        totalCierres += parseFloat(cierres[i].total);
        totalRecargo += parseFloat(cierres[i].payDivision["recargo"] || 0);

        cierresTotales.push([
          { text: `Cierre ${parseInt(i) + 1}` },
          { text: toHour(cierres[i].start) },
          {
            text:
              i + 1 == cierres.length
                ? toHour(new Date())
                : toHour(cierres[i].end)
          },
          { text: parseFloat(cierres[i].total).toFixed(2) }
        ]);

        // Ingresos

        for (let item of this.getIngresos(
          cierres[i].start,
          cierres[i]._current ? new Date() : cierres[i].end
        )) {
          totalIngresos += parseFloat(item.money);

          ingresos.push([
            { text: item.desc },
            { text: toHour(item.time) },
            { text: parseFloat(item.money).toFixed(2) }
          ]);
        }

        // Egresos

        for (let item of this.getEgresos(
          cierres[i].start,
          cierres[i]._current ? new Date() : cierres[i].end
        )) {
          totalEgresos += parseFloat(item.money);

          egresos.push([
            { text: item.desc },
            { text: toHour(item.time) },
            { text: parseFloat(item.money).toFixed(2) }
          ]);
        }
      }

      // Total de ventas

      for (let total of this.getTotal(cierres)) {
        ventas.push([
          { text: total.item.name },
          {
            text: composeMagnitude(total.amount, total.item.type)
          },
          { text: parseFloat(total.money).toFixed(2) }
        ]);
      }

      // Total de ventas

      cierresTotales.push([
        { text: "Total de ventas", colSpan: 3 },
        {},
        {},
        { text: parseFloat(totalCierres).toFixed(2) }
      ]);

      // Ingreso y egreso header

      ingresos.push([
        { text: "Total de ingresos", colSpan: 2 },
        {},
        { text: parseFloat(totalIngresos).toFixed(2) }
      ]);
      egresos.push([
        { text: "Total de egresos", colSpan: 2 },
        {},
        { text: parseFloat(totalEgresos).toFixed(2) }
      ]);

      [
        { text: "DESCRIPCION", style: "tableHeader" },
        { text: "IMPORTE $", style: "tableHeader" }
      ];

      resumen.push([
        { text: "TOTAL CIERRES", style: "title2" },
        { text: `$ ${parseFloat(totalCierres).toFixed(2)}`, style: "title2" }
      ]);
      resumen.push([
        { text: "TOTAL INGRESOS", style: "title2" },
        { text: `$ ${parseFloat(totalIngresos).toFixed(2)}`, style: "title2" }
      ]);
      resumen.push([
        { text: "TOTAL EGRESOS", style: "title2" },
        { text: `$ ${parseFloat(totalEgresos).toFixed(2)}`, style: "title2" }
      ]);
      resumen.push([
        { text: "TOTAL RECARGOS", style: "title2" },
        { text: `$ ${parseFloat(totalRecargo).toFixed(2)}`, style: "title2" }
      ]);
      resumen.push([
        { text: "TOTAL NETO", style: "title2" },
        {
          text: `$ ${parseFloat(
            totalCierres + totalIngresos + totalRecargo - totalEgresos
          ).toFixed(2)}`,
          style: "title2"
        }
      ]);

      Print.print({
        content: [
          {
            table: {
              dontBreakRows: true,
              widths: ["*"],
              body: titleHeader
            }
          },
          {
            table: {
              headerRows: 3,
              dontBreakRows: true,
              keepWithHeaderRows: 1,
              widths: ["*", "*", "*", "*"],
              body: cierresTotales
            }
          },
          {
            table: {
              headerRows: 2,
              dontBreakRows: true,
              keepWithHeaderRows: 1,
              widths: ["70%", "10%", "20%"],
              body: ingresos
            }
          },
          {
            table: {
              headerRows: 2,
              dontBreakRows: true,
              keepWithHeaderRows: 1,
              widths: ["70%", "10%", "20%"],
              body: egresos
            }
          },
          {
            table: {
              dontBreakRows: true,
              widths: ["70%", "30%"],
              body: resumen
            }
          },
          {
            table: {
              headerRows: 2,
              dontBreakRows: true,
              keepWithHeaderRows: 1,
              widths: ["60%", "20%", "20%"],
              body: ventas
            }
          }
        ],
        styles: {
          title: {
            alignment: "center",
            bold: true,
            fontSize: 15,
            color: "black"
          },
          title2: {
            bold: true,
            fontSize: 15,
            color: "black"
          },
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
    flex-direction: row;
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
      min-width: 100px;
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
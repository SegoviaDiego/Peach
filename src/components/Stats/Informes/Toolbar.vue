<template>
  <div class="grid">
    <div v-if="exists" class="sections">
      
      <!-- Select -->
      <template v-if="cierres.length > 3">
        <el-select :value="cierreIndex" @change="setIndex($event)" placeholder="Seleccionar cierre">
          <el-option label="Total" :value="totalIndex"/>
          <template v-for="i of cierres.length">
            <el-option
              :key="'cierre-'+i"
              :label="getLabel(i)"
              :value="i">
            </el-option>
          </template>
        </el-select>
      </template>

      <!-- Buttons -->
      <template v-if="cierres.length <= 3">
        <template v-for="i of cierres.length">
          <div
            :key="'sec-' + i"
            @click="setIndex(i)"
            :class="{section: true, active: i == cierreIndex }">
            <div class="title">
              {{getLabel(i)}}
            </div>
            <div class="line"/>
          </div>
        </template>
      </template>

      <!-- Total -->
      <div
        @click="setIndex(totalIndex)"
        :class="{section: true, active: cierreIndex == totalIndex }">
        <div class="title">
          Total
        </div>
        <div class="line"/>
      </div>

    </div>
    
    <template v-if="cierreIndex">
      <div class="searchbar">
        <input
          :value="filter"
          @input="filterChanged($event.target.value)"
          placeholder="Buscar" type="text">
      </div>
      
      <div class="btnTools">
        <button @click="selectingDate = true" class="rect">
          Fecha
        </button>
        <button @click="selectingPrint = true" class="circle">
          <fontawesome icon="print" />
        </button>
      </div>
    </template>

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

import Print from "@/Server/Src/Print";
import {
  equalDates,
  composeMagnitude,
  toHour,
  toHumanDate,
  toMagnitude
} from "@/Server/mongodb/Utils";
import { log as types, totals as totalTypes } from "@/vuexTypes";
import { major } from "semver";

export default Vue.extend({
  name: "informes-toolbar",
  computed: mapState({
    movements: state => state.Log.mov,
    exists: state => state.Total.exists,
    filter: state => state.Total.filter,
    isLoading: state => state.Total.loading,
    cierreIndex: state => state.Total.cierreIndex,
    date: state => state.Total.date,
    cierres(state) {
      if (state.Total.data) return state.Total.data.cierres;
      return [];
    },
    products(state) {
      return _.mapKeys(state.Product.data, function(value, key) {
        return value._id;
      });
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
      if (this.cierres.length == i)
        return `
      ${toHour(this.cierres[i - 1].start)} - ${toHour(new Date())}`;
      return `
      ${toHour(this.cierres[i - 1].start)} - ${toHour(
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
      let total = {};
      let item;

      for (let cierre of cierres) {
        for (let i of cierre.data) {
          item = { ...i };

          if (!total[item._id]) total[item._id] = item;
          else {
            total[item._id].money += item.money;
            total[item._id].amount += item.amount;
          }
        }
      }
      return _.map(total);
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
        totalCierres,
        totalEgresos,
        totalIngresos;

      titleHeader = [
        [{ text: "INFORME: Rey del vigilante", style: "title" }],
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

      totalCierres = 0;
      totalIngresos = 0;
      totalEgresos = 0;

      for (let i in cierres) {
        totalCierres += parseFloat(cierres[i].total);

        cierresTotales.push([
          { text: `Cierre ${parseInt(i) + 1}` },
          { text: toHour(cierres[i].start) },
          {
            text:
              i + 1 == cierres.length
                ? toHour(new Date())
                : toHour(cierres[i].end)
          },
          { text: cierres[i].total }
        ]);

        for (let item of this.getIngresos(
          cierres[i].start,
          cierres[i]._current ? new Date() : cierres[i].end
        )) {
          totalIngresos += parseFloat(item.money);

          ingresos.push([
            { text: item.desc },
            { text: toHour(item.time) },
            { text: item.money }
          ]);
        }

        for (let item of this.getEgresos(
          cierres[i].start,
          cierres[i]._current ? new Date() : cierres[i].end
        )) {
          totalEgresos += parseFloat(item.money);

          egresos.push([
            { text: item.desc },
            { text: toHour(item.time) },
            { text: item.money }
          ]);
        }
      }

      cierresTotales.push([
        { text: "Total de ventas", colSpan: 3 },
        {},
        {},
        { text: totalCierres }
      ]);

      ingresos.push([
        { text: "Total de ingresos", colSpan: 2 },
        {},
        { text: totalIngresos }
      ]);
      egresos.push([
        { text: "Total de egresos", colSpan: 2 },
        {},
        { text: totalEgresos }
      ]);
      egresos.push([
        { text: "Total", colSpan: 2 },
        {},
        { text: totalCierres + totalIngresos - totalEgresos }
      ]);

      for (let item of this.getTotal(cierres)) {
        ventas.push([
          { text: this.products[item._id].name },
          { text: composeMagnitude(item.amount, 2) },
          { text: item.money }
        ]);
      }

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
.grid {
  grid-area: toolbar;
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 3fr 300px 2fr;
  grid-template-areas: "sections searchbar buttons";
  overflow: hidden;
  .sections {
    grid-area: sections;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    overflow: hidden;
    .section {
      flex: 1;
      height: 100%;
      padding: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      * {
        transition: 200ms;
      }
      &:hover .line,
      &.active .line {
        margin-top: 7px;
        background-color: #000;
        width: 60%;
        height: 5px;
      }
      .title {
        margin: 0;
        text-transform: capitalize;
        font-family: Lato;
        font-weight: bold;
        font-size: 25px;
        color: #000;
      }
      .line {
        margin-top: 5px;
        background-color: #a0a0a0;
        width: 30%;
        height: 3px;
      }
    }
  }
  .searchbar {
    grid-area: searchbar;
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
  .btnTools {
    grid-area: buttons;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
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
    }
    .rect {
      height: 40px;
      width: 100px;
    }
    .circle {
      $circleSize: 40px;
      height: $circleSize;
      width: $circleSize;
      border-radius: 50%;
      font-size: 18px;
    }
  }
}
</style>
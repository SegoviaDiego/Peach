<template>
  <div class="grid">
    <div v-if="exists" class="sections">
      
      <!-- Select -->
      <template v-if="cierres > 3">
        <el-select :value="cierreIndex" @change="setIndex($event)" placeholder="Seleccionar cierre">
          <el-option label="Total" :value="totalIndex"/>
          <template v-for="i of cierres">
            <el-option
              :key="'cierre-'+i"
              :label="getLabel(i)"
              :value="i">
            </el-option>
          </template>
        </el-select>
      </template>

      <!-- Buttons -->
      <template v-if="cierres <= 3">
        <template v-for="i of cierres">
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
        <el-select v-model="selectedCierre" placeholder="Seleccionar cierre">
           <template v-for="i of cierres">
            <el-option
              :key="'cierre-'+i"
              :label="getLabel(i)"
              :value="i">
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

import { equalDates } from "../../../store/backendish/Src/Utils";
import { totals as types } from "../../../store/vuexTypes";

import Print from "@/Server/Src/Print";
import { composeMagnitude, toHour } from "@/Server/mongodb/Utils";

export default Vue.extend({
  name: "informes-toolbar",
  computed: mapState({
    exists: state => state.Total.exists,
    filter: state => state.Total.filter,
    isLoading: state => state.Total.loading,
    cierreIndex: state => state.Total.cierreIndex,
    date: state => state.Total.date,
    cierres(state) {
      if (state.Total.data) {
        return state.Total.data.cierres.length;
      }
      return 0;
    },
    products(state) {
      return _.mapKeys(state.Product.data, function(value, key) {
        return value._id;
      });
    }
  }),
  data: () => ({
    totalIndex: types.totalIndex,
    selectingDate: false,
    selectingPrint: false,
    selectedDate: null,
    selectedCierre: null,
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
    getLabel(i) {
      if (this.cierres == i && equalDates(new Date(), this.date))
        return "Turno actual";
      return "Cierre " + i;
    },
    filterChanged(value) {
      this.$store.dispatch(types.filter, value);
    },
    setIndex(index) {
      this.$store.dispatch(types.setCierreIndex, index);
    },
    setDate() {
      this.$store.dispatch(types.setDate, this.selectedDate).then(() => {
        this.$store.dispatch(types.load);
        this.selectingDate = false;
      });
    },
    validatePrint() {
      if (!this.selectedCierre) {
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
    print() {
      let printData = [];

      printData.push([
        { text: "PLU", style: "tableHeader" },
        { text: "HORA", style: "tableHeader" },
        { text: "NOMBRE", style: "tableHeader" },
        { text: "INGRESADO", style: "tableHeader" }
      ]);

      let topTable = [
        { text: "PLU", style: "tableHeader" },
        { text: "HORA", style: "tableHeader" },
        { text: "NOMBRE", style: "tableHeader" },
        { text: "INGRESADO", style: "tableHeader" }
      ];

      Print.print({
        content: [
          {
            table: {
              headerRows: 1,
              dontBreakRows: true,
              keepWithHeaderRows: 1,
              widths: [50, 50, "*", "20%"],
              body: printData
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
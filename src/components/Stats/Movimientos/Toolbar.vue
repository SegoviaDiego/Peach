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
    <button @click="creatingMov = true" class="rect">
      Crear movimiento
    </button>
    <button @click="selectingDate = true" class="rect">
      Fecha
    </button>
    <button @click="selectingPrint = true" class="circle">
      <fontawesome icon="print" />
    </button>
    
    <!-- Dialog -->
    <el-dialog
      title="Crear movimiento"
      :visible.sync="creatingMov"
      width="50%">
      <div>
        <el-select v-model="movType" placeholder="Seleccionar tipo de movimiento">
          <el-option label="Ingreso" :value="1"/>
          <el-option label="Egreso" :value="2"/>
        </el-select>
        <el-input placeholder="Descripcion" v-model="movDesc" />
        <el-input placeholder="Dinero" type="number" v-model="movMoney" />
        
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="creatingMov = false">Cancelar</el-button>
        <el-button type="primary" @click="validateMov()">Guardar</el-button>
      </span>
    </el-dialog>

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
        <el-time-picker
          is-range
          v-model="selectedTime"
          start-placeholder="Desde"
          range-separator="|"
          end-placeholder="Hasta">
        </el-time-picker>
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
import { log as types } from "@/vuexTypes";
import Print from "@/Server/Src/Print";
import { composeMagnitude, toHour } from "@/Server/mongodb/Utils";

export default Vue.extend({
  name: "informes-toolbar",
  components: {},
  mounted() {},
  computed: mapState({
    isLoading: state => state.Log.loading,
    showSpinner: state => state.Log.showSpinner,
    filter: state => state.Log.filter,
    date: state => state.Log.date,
    data: state => state.Log.ingreso,
    products(state) {
      return _.mapKeys(state.Product.data, function(value, key) {
        return value._id;
      });
    }
  }),
  data: () => ({
    selectingDate: false,
    selectingPrint: false,
    creatingMov: false,
    selectedDate: null,
    selectedTime: null,
    selectedPrint: null,
    movDesc: null,
    movMoney: null,
    movType: null,
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
    validateMov() {
      if (!this.movType) {
        this.$notify({
          title: "No has seleccionado el tipo de movimiento!",
          message: "",
          type: "warning",
          duration: 5000,
          offset: 170
        });
      } else if (!this.movDesc) {
        this.$notify({
          title: "No has ingresado una descripcion!",
          message: "",
          type: "warning",
          duration: 5000,
          offset: 170
        });
      } else if (!this.movMoney) {
        this.$notify({
          title: "No has ingresado un valor monetario!",
          message: "",
          type: "warning",
          duration: 5000,
          offset: 170
        });
      } else {
        this.createMov();
      }
    },
    createMov() {
      this.$store
        .dispatch(types.createMov, {
          type: this.movType,
          desc: this.movDesc,
          money: this.movMoney
        })
        .then(() => {
          this.$store.dispatch(types.loadMov);
          this.creatingMov = false;
          this.movType = null;
          this.movDesc = null;
          this.movMoney = null;
        });
    },
    filterChanged(value) {
      this.$store.dispatch(types.filter, value);
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
      this.$store.dispatch(types.setDate, this.selectedDate).then(() => {
        this.$store.dispatch(types.loadIngreso);
        this.selectingDate = false;
      });
    },
    validatePrint() {
      if (!this.selectedTime) {
        this.$notify({
          title: "No seleccionaste un rango horario!",
          message: "No has colocado ningun valor.",
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
      let ingresos = [...this.data];
      let from = this.selectedTime[0];
      let to = this.selectedTime[1];

      printData.push([
        { text: "PLU", style: "tableHeader" },
        { text: "HORA", style: "tableHeader" },
        { text: "NOMBRE", style: "tableHeader" },
        { text: "INGRESADO", style: "tableHeader" }
      ]);

      ingresos = ingresos.sort((a, b) => {
        return b.time - a.time;
      });

      for (let item of ingresos) {
        if (item.time > from && item.time < to)
          printData.push([
            item.productId,
            toHour(item.time),
            this.products[item.productId].name,
            composeMagnitude(item.amount, this.products[item.productId].type)
          ]);
      }

      if (printData.length == 1) {
        this.$notify({
          title: "Impresion vacia!",
          message: `No se realizaron ventas en el rango seleccionado. 
            Seleccione un rango mas amplio`,
          type: "warning",
          duration: 5000,
          offset: 170
        });
        return;
      } else {
        this.selectingPrint = false;
        this.selectedTime = null;
      }

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
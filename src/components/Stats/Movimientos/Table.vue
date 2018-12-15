<template>
  <div class="grid">
    <Toolbar/>
    <OxyTable v-model="filteredData">
      <Row slot="row" slot-scope="log" :key="log._id">
        <Cell label="Hora" sortBy="_id" :colSpan="1">{{toHour(new Date(log.time))}}</Cell>
        <Cell label="Descripcion" sortBy="_id" :colSpan="3">{{log.desc}}</Cell>
        <Cell label="Tipo" sortBy="_id" :colSpan="2">{{getType(log.type)}}</Cell>
        <Cell label="Valor" sortBy="_id" :colSpan="2">${{log.money}}</Cell>
        <Cell :colSpan="1" class="centerBtn">
          <el-tooltip content="Editar" placement="top">
            <button class="circle" @click="openDialog(log)" :disabled="editModal">
              <fontawesome icon="pen"/>
            </button>
          </el-tooltip>
          <el-tooltip content="Eliminar" placement="top">
            <button class="circle" @click="openDeleteModal(log._id)" :disabled="deleteModal">
              <fontawesome icon="trash-alt"/>
            </button>
          </el-tooltip>
        </Cell>
      </Row>
    </OxyTable>
    <!-- Edit mov dialog -->
    <el-dialog title="Editar movimiento" :visible.sync="editModal" width="50%">
      <!-- Dialog's body -->
      <div class="dialogBody">
        <div class="field">
          <div class="label">Tipo</div>
          <div class="input">
            <el-select v-model="mutation.type" placeholder="Seleccionar tipo de movimiento">
              <el-option label="Ingreso" :value="1"/>
              <el-option label="Egreso" :value="2"/>
            </el-select>
          </div>
        </div>
        <div class="field">
          <div class="label">Descripcion</div>
          <div class="input">
            <el-input v-model="mutation.desc" placeholder="Descripcion"/>
          </div>
        </div>
        <div class="field">
          <div class="label">Dinero</div>
          <div class="input">
            <el-input v-model="mutation.money" placeholder="Dinero" type="number"/>
          </div>
        </div>
      </div>
      <!-- Dialog's body -->
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="editModal = false">Cancelar</el-button>
        <el-button class="success" @click="saveMutation()">Guardar cambios</el-button>
      </span>
    </el-dialog>
    <!-- Delete dialog -->
    <el-dialog title="Eliminar movimiento" :visible.sync="deleteModal" width="50%">
      <!-- Dialog's body -->
      <div class="dialogBody"></div>
      <!-- Dialog's body -->
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="deleteModal = false">Cancelar</el-button>
        <el-button class="success" @click="delMov()">Eliminar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import { ObjectId } from "mongodb";
import Toolbar from "./Toolbar.vue";
import { log as types } from "@/vuexTypes";
import { toHour } from "@/api/Utils";
import OxyTable from "@/components/Table/index.vue";
import Row from "@/components/Table/Row.vue";
import Cell from "@/components/Table/Cell.vue";

function filterData(data, filter) {
  if (!filter) {
    return data;
  } else if (isNaN(filter)) {
    return data.filter(item => {
      return item["name"].toLowerCase().includes(filter.toLowerCase());
    });
  } else {
    return data.filter(item => {
      return parseFloat(item._id) == parseFloat(filter);
    });
  }
}
function sortData(data) {
  return data.sort((a, b) => {
    return new Date(b.time) - new Date(a.time);
  });
}

export default Vue.extend({
  name: "informes-table",
  components: {
    Toolbar,
    OxyTable,
    Row,
    Cell
  },
  mounted() {
    this.$store.dispatch(types.loadMov);
  },
  data: () => ({
    editModal: false,
    deleteModal: false,
    deleteId: null,
    openPrintDialog: false,
    mutation: {
      type: null,
      desc: null,
      money: null
    }
  }),
  computed: mapState({
    filter: state => state.Log.filter,
    isLoading: state => state.Log.loading,
    filteredData(state) {
      return sortData(filterData([...state.Log.mov], this.filter));
    }
  }),
  methods: {
    toHour: toHour,
    openDialog(mov) {
      this.mutation = mov;
      this.editModal = true;
    },
    openDeleteModal(id) {
      this.deleteModal = true;
      this.deleteId = id;
    },
    delMov() {
      this.$store
        .dispatch(types.deleteMov, this.deleteId)
        .then(() => {
          this.deleteModal = false;
          this.$notify({
            title: "Se ha eliminado el movimiento con exito.",
            message: "",
            type: "success",
            duration: 3000,
            offset: 170
          });
        })
        .catch(err => {
          console.log("Movement deletion Error: ", err);
          this.$notify({
            title: "No se ha podido eliminar el movimiento.",
            message: "",
            type: "error",
            duration: 3000,
            offset: 170
          });
        });
    },
    saveMutation() {
      if (!this.mutation.type) {
        this.$notify({
          title: "No has seleccionado el tipo de movimiento!",
          message: "",
          type: "warning",
          duration: 5000,
          offset: 170
        });
      } else if (!this.mutation.desc || !this.mutation.desc.length) {
        this.$notify({
          title: "No has escrito la descripcrion!",
          message: "",
          type: "warning",
          duration: 5000,
          offset: 170
        });
      } else if (!this.mutation.money) {
        this.$notify({
          title: "No has escrito el dinero del movimiento.",
          message: "",
          type: "warning",
          duration: 5000,
          offset: 170
        });
      } else if (this.mutation.money <= 0) {
        this.$notify({
          title: "El dinero debe ser mayor a 0",
          message: "",
          type: "warning",
          duration: 5000,
          offset: 170
        });
      } else {
        this.$store
          .dispatch(types.mutateMov, this.mutation)
          .then(() => {
            this.editModal = false;
            this.$notify({
              title: "Se ha modificado el movimiento con exito.",
              message: "",
              type: "success",
              duration: 3000,
              offset: 170
            });
          })
          .catch(err => {
            console.log("Movement mutation Error: ", err);
            this.$notify({
              title: "No se ha podido modificar el movimiento.",
              message: "",
              type: "error",
              duration: 3000,
              offset: 170
            });
          });
      }
    },
    getType(type) {
      switch (type) {
        case 1:
          return "Ingreso";
        case 2:
          return "Egreso";
        default:
          return "";
      }
    },
    closePrintDialog() {
      this.openPrintDialog = false;
    },
    print() {
      this.openPrintDialog = true;
    }
  }
});
</script>

<style lang="scss" scoped>
.grid {
  flex: 1;
  padding: 10px;
  grid-area: table;
  display: grid;
  grid-template-rows: 70px 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: "toolbar" "table";
  overflow: hidden;
  background-color: #eeeeee;
  border-radius: 7px;
}
.centerBtn {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
button.circle {
  background-color: #fdd835;
  height: 30px;
  width: 30px;
  font-size: 15px;
  border: none;
  border-radius: 50%;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
  overflow: hidden;
  transition: 200ms;
  &:hover {
    color: #ff5722;
  }
}
.field {
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .label {
    flex: 1;
    font-family: Lato;
    font-weight: bold;
    font-size: 20px;
    color: black;
  }
  .input {
    flex: 3;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .el-input {
      margin-left: 10px;
    }
  }
}
</style>
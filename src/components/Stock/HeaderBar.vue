<template>
  <div class="header">
    <div class="searchbar">
      <div class="container">
        <div class="inputContainer">
          <input
              :value="filter"
              @input="filterChanged($event.target.value)"
              placeholder="Buscar producto" type="text">
        </div>
        <div class="icon">
          <fontawesome icon="search" />
        </div>
      </div>
    </div>
    <div class="buttons">
      <template v-if="route === routes.default">
        <el-tooltip content="Ingresar productos" placement="top">
          <button @click="goTo(routes.inStock)" class="rounded">
            Ingreso
          </button>
        </el-tooltip>
        <el-tooltip content="Egresar productos" placement="top">
          <button @click="goTo(routes.outStock)" class="rounded">
            Egreso
          </button>
        </el-tooltip>
        <el-tooltip content="Imprimir stock" placement="top">
          <button @click="print()" class="circle gray">
            <fontawesome icon="print" />
          </button>
        </el-tooltip>
        <template v-if="isMoreActive(1)">
          <el-tooltip content="Opciones" placement="top">
            <button @click="goTo(routes.more)" class="circle">
              <fontawesome icon="ellipsis-h" />
            </button>
          </el-tooltip>
        </template>
        <el-tooltip content="Volver atras" placement="top">
          <button @click="goBack()" class="circle">
            <fontawesome icon="chevron-left" />
          </button>
        </el-tooltip>
      </template>
      <template v-else-if="route === routes.more">
        <el-tooltip content="Volver atras" placement="top">
          <button @click="goTo(routes.default)" class="circle">
            <fontawesome icon="chevron-left" />
          </button>
        </el-tooltip>
        <template v-if="isMoreActive(routes.createItem)">
          <el-tooltip content="Crear producto" placement="top">
            <button @click="goTo(routes.createItem)" class="circle">
              <fontawesome icon="plus" />
            </button>
          </el-tooltip>
        </template>
        <template v-if="isMoreActive(routes.editItems)">
          <el-tooltip content="Editar productos" placement="top">
            <button @click="goTo(routes.editItems)" class="circle">
              <fontawesome icon="pen" />
            </button>
          </el-tooltip>
        </template>
        <template v-if="isMoreActive(routes.deleteItems)">
          <el-tooltip content="Borrar productos" placement="top">
            <button @click="goTo(routes.deleteItems)" class="circle">
              <fontawesome icon="trash-alt" />
            </button>
          </el-tooltip>
        </template>
      </template>
      <template v-else-if="route === routes.createItem">
        <el-tooltip content="Cancelar" placement="top">
          <button @click="goTo(routes.more, routes.createItem)" class="circle">
            <fontawesome icon="times" />
          </button>
        </el-tooltip>
        <el-tooltip content="Crear producto" placement="top">
          <button @click="validateItem()" class="circle">
            <fontawesome icon="save" />
          </button>
        </el-tooltip>
      </template>
      <template v-else-if="route === routes.deleteItems">
        <el-tooltip content="Cancelar" placement="top">
          <button @click="goTo(routes.more, routes.deleteItems)" class="circle">
            <fontawesome icon="times" />
          </button>
        </el-tooltip>
        <el-tooltip content="Borrar productos" placement="top">
          <button @click="saveDeletes()" class="circle">
            <fontawesome icon="save" />
          </button>
        </el-tooltip>
      </template>
      <template v-else-if="route === routes.editItems">
        <el-tooltip content="Cancelar" placement="top">
          <button @click="goTo(routes.more, routes.editItems)" class="circle">
            <fontawesome icon="times" />
          </button>
        </el-tooltip>
        <el-tooltip content="Guardar cambios" placement="top">
          <button @click="saveChanges()" class="circle">
            <fontawesome icon="save" />
          </button>
        </el-tooltip>
      </template>
      <template v-else-if="route === routes.inStock">
        <el-tooltip content="Cancelar" placement="top">
          <button @click="goTo(routes.default, routes.inStock)" class="circle">
            <fontawesome icon="times" />
          </button>
        </el-tooltip>
        <el-tooltip content="Guardar ingreso" placement="top">
          <button @click="saveInStock()" class="circle">
            <fontawesome icon="save" />
          </button>
        </el-tooltip>
      </template>
      <template v-else-if="route === routes.outStock">
        <el-tooltip content="Cancelar" placement="top">
          <button @click="goTo(routes.default, routes.outStock)" class="circle">
            <fontawesome icon="times" />
          </button>
        </el-tooltip>
        <el-tooltip content="Guardar egreso" placement="top">
          <button @click="saveOutStock()" class="circle">
            <fontawesome icon="save" />
          </button>
        </el-tooltip>
        <div class="select">
          <el-select v-model="type" placeholder="Tipo de egreso">
            <el-option :value="1" label="Vencimiento" />
            <el-option :value="2" label="Reciclado" />
            <el-option :value="3" label="Transferencia" />
          </el-select>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { products as types } from "@/vuexTypes";
import Product from "@/Server/mongodb/Product";
import _ from "lodash";

export default Vue.extend({
  name: "products-header",
  props: {
    newItem: Object,
    deleteSelection: {},
    mutatedProducts: {}
  },
  computed: mapState({
    isLoading: (state: any) => state.Product.loading,
    inputs: (state: any) => state.Product.inputs,
    showSpinner: (state: any) => state.Product.showSpinner,
    route: (state: any) => state.Product.buttonRoute,
    filter: (state: any) => state.Product.filter,
    preferences: (state: any) => state.Settings.preferences
  }),
  data: () => ({
    type: null,
    routes: types.routes
  }),
  methods: {
    isMoreActive(type: any) {
      switch (type) {
        case 1:
          return (
            this.preferences["newP"] ||
            this.preferences["mutableP"] ||
            this.preferences["deleteP"]
          );
        case this.routes.createItem:
          return this.preferences["newP"];
        case this.routes.editItems:
          return this.preferences["mutableP"];
        case this.routes.deleteItems:
          return this.preferences["deleteP"];
        default:
          return false;
      }
    },
    filterChanged(value: any) {
      this.$store.dispatch(types.filter, value);
    },
    print() {
      this.$emit("print");
    },
    goBack() {
      this.$router.replace({ path: "/dashboard" });
    },
    goTo(route: any, from: any) {
      this.type = null;
      this.$emit("go-to", route, from);
    },
    saveInStock() {
      let inputs = _.pickBy(this.inputs, _.identity);
      if (_.isEmpty(inputs)) {
        this.$notify({
          title: "Ingreso vacio!",
          message: "No has colocado ningun valor al ingreso.",
          type: "warning",
          duration: 5000,
          offset: 170
        });
      } else {
        this.$store.dispatch(types.inStock);
        this.goTo(types.routes.default, types.routes.inStock);
      }
    },
    saveOutStock() {
      let inputs = _.pickBy(this.inputs, _.identity);
      if (!this.type) {
        this.$notify({
          title: "No has seleccionado un tipo de egreso",
          message:
            "Antes de guardar los cambios debes elegir el tipo de egreso (Transferencia, reciclado o baja)",
          type: "warning",
          duration: 5000,
          offset: 170
        });
      } else if (_.isEmpty(inputs)) {
        this.$notify({
          title: "Egreso vacio!",
          message: "No has colocado ningun valor al egreso.",
          type: "warning",
          duration: 5000,
          offset: 170
        });
      } else {
        this.$store.dispatch(types.outStock, this.type);
        this.goTo(types.routes.default, types.routes.outStock);
      }
    },
    async validateItem() {
      if (!this.newItem["_id"]) {
        this.$notify({
          title: "No has colocado un codigo!",
          message: "No has colocado ningun valor al codigo.",
          type: "warning",
          duration: 5000,
          offset: 170
        });
        return;
      } else if (await Product.productExists(this.newItem["_id"])) {
        this.$notify({
          title: "El codigo ingresado ya existe!",
          message: "El valor del codigo debe ser unico para cada producto.",
          type: "warning",
          duration: 5000,
          offset: 170
        });
        return;
      } else if (!this.newItem["name"]) {
        this.$notify({
          title: "No has colocado un nombre!",
          message: "",
          type: "warning",
          duration: 5000,
          offset: 170
        });
        return;
      } else if (isNaN(this.newItem["price"])) {
        this.$notify({
          title: "No has colocado un precio!",
          message: "",
          type: "warning",
          duration: 5000,
          offset: 170
        });
        return;
      } else if (parseFloat(this.newItem["price"]) < 0) {
        this.$notify({
          title: "El precio no puede ser menor a 0!",
          message: "",
          type: "warning",
          duration: 5000,
          offset: 170
        });
        return;
      }
      this.$store
        .dispatch(types.create, {
          ...this.newItem,
          _id: this.newItem._id.toString()
        })
        .then(() => {
          this.goTo(types.routes.default, types.routes.createItem);
        });
    },
    saveChanges() {
      this.$store.dispatch(types.modify, this.mutatedProducts).then(() => {
        this.goTo(types.routes.default, types.routes.editItems);
      });
    },
    saveDeletes() {
      this.$store.dispatch(types.delete, this.deleteSelection).then(() => {
        this.goTo(types.routes.default, types.routes.deleteItems);
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.header {
  grid-area: header;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "searchbar buttons";
  padding: 0 2%;
  .searchbar {
    height: 55px;
    $radius: 30px;
    grid-area: searchbar;
    display: flex;
    background-color: #fdd835;
    border-bottom-left-radius: $radius;
    border-top-right-radius: $radius;
    padding: 0px $radius;
    overflow: hidden;
    .container {
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background-color: #e1e2e1;
    }
    .inputContainer {
      flex: 8;
      height: 100%;
      background-color: transparent;
      input {
        padding: 0px 10px;
        font-size: 20px;
        font-weight: bold;
        width: 100%;
        height: 100%;
        border-color: none;
        outline: none;
        background-color: transparent !important;
        border: none;
        border-radius: none;
        box-shadow: none;
      }
    }
    .icon {
      flex: 1;
      height: 100%;
      display: flex;
      margin-right: 15px;
      justify-content: flex-end;
      align-items: center;
      font-size: 34px;
      color: #3d3d3d;
    }
  }
  .buttons {
    grid-area: buttons;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    button {
      margin-left: 5px;
      transition: 300ms;
      &:hover {
        color: #ff5722;
      }
    }
    .rounded {
      background-color: #fdd835;
      height: 55px;
      width: 130px;
      border: none;
      padding: 15px 20px;
      text-decoration: none;
      text-transform: uppercase;
      border-radius: 40px;
      font-family: Lato;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
    }
    .circle {
      &.gray {
        background-color: #e1e2e1;
      }
      background-color: #fdd835;
      height: 55px;
      width: 55px;
      border: none;
      text-decoration: none;
      text-transform: uppercase;
      border-radius: 50%;
      cursor: pointer;
      font-size: 24px;
    }
    .select {
      margin-left: 10px;
    }
  }
}
</style>
<template>
  <div class="opcionesAvanzadasNavbarFlex">
    <div class="leftSide">
      <div class="searchbar">
        <div class="container">
          <div class="inputContainer">
            <input
              :value="filter"
              @input="filterChanged($event.target.value)"
              placeholder="Buscar producto"
              type="text"
            >
          </div>
          <div class="icon">
            <fontawesome icon="search"/>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <!-- Go back button -->
      <button @click="openComposeDialog">Crear producto</button>
      <!-- Go back button -->
      <button @click="goBack">Volver atras</button>
    </div>

    <!-- Dialog -->
    <el-dialog width="90%" title="Crear producto compuesto" :visible.sync="composedProdDialog">
      <!-- Dialog's body -->
      <div class="dialogBody">
        <div class="title">Seleccionar producto a componer</div>
        <div class="form">
          <el-select v-model="composedId" filterable placeholder="Seleccionar producto">
            <template v-for="item of products">
              <el-option
                :key="'composedProdSelect-' + item._id"
                :label="item.name"
                :value="item._id"
              />
            </template>
          </el-select>
        </div>

        <template v-if="composedId">
          <div class="title">Seleccionar compuestos</div>
          <div class="form">
            <el-select
              v-model="composersId"
              filterable
              multiple
              placeholder="Seleccionar compuestos"
            >
              <template v-for="item of products">
                <el-option
                  :key="'compuestosSelect-' + item._id"
                  :label="item.name"
                  :value="item._id"
                />
              </template>
            </el-select>
          </div>
          <div class="composersTable" v-if="composersId.length > 0">
            <OxyTable v-model="composers">
              <Row slot="row" slot-scope="item" :key="item._id">
                <Cell label="Codigo" sortBy="_id" :colSpan="1">{{item._id}}</Cell>
                <Cell label="Producto" sortBy="name" :colSpan="2">{{item.name}}</Cell>
                <Cell label="Cantidad" :colSpan="1">
                  <el-input
                    v-model="composersValues[item._id]"
                    :min="0"
                    type="number"
                    placeholder="Cantidad"
                  />
                </Cell>
              </Row>
            </OxyTable>
          </div>
        </template>
      </div>
      <!-- Dialog's body -->
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="composedProdDialog = false">Cancelar</el-button>
        <el-button class="success" @click="createProduct">Crear</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import _ from "lodash";
import { products as types } from "@/vuexTypes";

import OxyTable from "@/components/Table/index.vue";
import Row from "@/components/Table/Row.vue";
import Cell from "@/components/Table/Cell.vue";

export default Vue.extend({
  name: "OpcionesAvanzadas-navbar",
  components: {
    OxyTable,
    Row,
    Cell
  },
  data: () => ({
    composedProdDialog: false,
    composedId: null,
    composersId: [],
    composersValues: {} as any
  }),
  computed: mapState({
    filter: (state: any) => state.Product.filter,
    products: (state: any) =>
      _.mapKeys(state.Product.data, (item: any) => {
        return item._id;
      }),
    composers() {
      const self: any = this;
      const res: any = [];
      for (const id of self.composersId) {
        if (self.products[id]) {
          res.push(self.products[id]);
        }
      }
      return res;
    }
  }),
  methods: {
    openComposeDialog() {
      this.composedProdDialog = true;
      this.composedId = null;
      this.composersId = [];
      this.composersValues = {};
    },
    createProduct() {
      if (this.isCreationValid()) {
        const composition: any = [];

        for (const _id of this.composersId) {
          composition.push({
            _id,
            equivalencia: this.composersValues[_id]
          });
        }

        this.$store
          .dispatch(types.compose, {
            _id: this.composedId,
            composition
          })
          .then(() => {
            console.log("done");
          });
      }
    },
    isCreationValid() {
      if (!this.composedId) {
        this.$notify({
          title: "No has seleccionado un producto a componer",
          message: "",
          type: "warning",
          duration: 4000,
          offset: 60
        });
        return false;
      } else if (!this.composers || this.composers.length == 0) {
        this.$notify({
          title: "No has seleccionado componentes",
          message: "",
          type: "warning",
          duration: 4000,
          offset: 60
        });
        return false;
      } else {
        const compsVals = _.toArray(this.composersValues);
        if (
          compsVals.length == 0 ||
          compsVals.length != this.composersId.length
        ) {
          this.$notify({
            title: "No has asignado la cantidad a todos los componentes",
            message: "",
            type: "warning",
            duration: 4000,
            offset: 60
          });
          return false;
        }

        for (const comp of compsVals) {
          if (comp <= 0) {
            this.$notify({
              title: "La cantidad asignada debe ser mayor a 0",
              message: "",
              type: "warning",
              duration: 4000,
              offset: 60
            });
          }
        }
      }
      return true;
    },
    filterChanged(value: any) {
      this.$store.dispatch(types.filter, value);
    },
    goBack() {
      this.$router.replace({ path: "/OpcionesAvanzadas" });
    }
  }
});
</script>

<style lang="scss" scoped>
.el-dialog {
  width: 100% !important;
}
.dialogBody {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  // align-items: center;

  .title {
    flex: 1;
    width: 100%;
    text-align: center;
  }

  .form {
    flex: 1;
    width: 100%;
    text-align: center;
  }

  .composersTable {
    flex: 1;
    width: 100%;
    display: grid;
    grid-template-areas: "table";
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }

  // @media screen and (max-width: 799px) {
  //   padding: 0px 5%;
  // }
  // @media screen and (min-width: 800px) {
  //   padding: 0px 10%;
  // }
}

.opcionesAvanzadasNavbarFlex {
  flex: 1;
  grid-area: navbar;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1.5fr;
  grid-template-areas: "searchbar buttons";
  padding: 0 10px;
  .leftSide {
    grid-area: searchbar;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .searchbar {
      flex: 1;
      height: 55px;
      $radius: 30px;
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
  }
  .buttons {
    grid-area: buttons;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    button {
      margin-left: 5px;
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
  }
}
</style>
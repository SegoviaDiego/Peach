<template>
  <div class="table">
    <div class="header">
      <div class="column">
        Codigo
      </div>
      <div class="column">
        Producto
      </div>
      <div class="column">
        Precio
      </div>
      <div class="column">
        En Stock
      </div>
    </div>
    <div class="body" v-loading="isLoading">
      <div v-if="route === routes.createItem" class="row">
        <div class="column">
          <input placeholder="Codigo" type="text" v-model.lazy="newItem._id">
        </div>
        <div class="column">
          <input placeholder="Nombre" type="text" v-model.lazy="newItem.name">
        </div>
        <div class="column">
          <input placeholder="Precio" type="number" min="0" v-model.lazy="newItem.price">
        </div>
        <div class="column">
        </div>
      </div>
      <div
      v-for="item in products"
      :key="item._id"
      class="row">
        <div class="column">
            {{item._id}}
        </div>
        <div class="column">
          <template v-if="route === routes.editItems">
            <input
              :value="changes[item._id]['name']"
              @change="editValue(item._id, 'name' , $event.target.value)"
              :placeholder="item.name" type="text">
          </template>
          <template v-else>
            {{item.name}}
          </template>
        </div>
        <div class="column">
          <template v-if="route === routes.editItems">
            <input
              :value="changes[item._id]['price']"
              @change="editValue(item._id, 'price' , $event.target.value)"
              :placeholder="item.price" type="number" min="0">
          </template>
          <template v-else>
            {{item.price}}
          </template>
        </div>
        <div class="column">
          <template v-if="route === routes.inStock || route === routes.outStock">
            <el-input-number
              v-model.lazy="amount[item._id]"
              :min="0" :value="0" />
          </template>
          <template v-else-if="route === routes.deleteItems">
            {{item.stock}}
            <input type="checkbox" 
            v-model="selected[item._id]">
          </template>
          <template v-else>
            {{item.stock}}
          </template>
        </div>
      </div>
    </div>
    <div class="background">
      <div class="header"/>
      <div class="body">
        <div class="column darker"></div>
        <div class="column"></div>
        <div class="column darker"></div>
        <div class="column"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from "Vuex";
import { products as types } from "../../store/vuexTypes";

export default {
  name: "products-table",
  props: {
    products: Array,
    newItem: {},
    amount: {},
    selected: {},
    changes: {},
    routes: {}
  },
  computed: mapState({
    isLoading: state => state.Products.loading,
    showSpinner: state => state.Products.showSpinner,
    route: state => state.Products.buttonRoute
  }),
  methods: {
    editValue(_id, att, value) {
      this.$emit("edit-item-value", _id, att, value);
    }
  }
};
</script>

<style lang="scss" scoped>
$scrollbarSize: 16px;
.table {
  position: relative;
  grid-area: table;
  $fontColor: #000;

  display: grid;
  grid-template-rows: 1fr 9fr;
  grid-template-columns: 1fr;
  grid-template-areas: "header" "body";
  min-height: 0;
  .header {
    padding-right: $scrollbarSize;
    grid-area: header;
    z-index: 2;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 3fr 1fr 3fr;
    .column {
      display: flex;
      padding-left: 10px;
      align-items: center;
      color: $fontColor;
      font-size: 28px;
      font-family: Lato;
      font-weight: bold;
      overflow: hidden;
    }
  }
  .body {
    grid-area: body;
    z-index: 2;
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: $scrollbarSize;
    }
    &::-webkit-scrollbar-track {
      background-color: #e1e2e1;
    }
    &::-webkit-scrollbar-thumb {
      $borderSize: 7px;
      background-color: #fdd835;
      border-top: $borderSize solid black;
      border-bottom: $borderSize solid black;
    }
    .row {
      margin: 10px 0px;
      $h: 40px;
      $fs: 25px;
      min-height: $h;
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: 1fr 3fr 1fr 3fr;
      .column {
        overflow: hidden;
        display: flex;
        padding: 0 $scrollbarSize;
        // align-items: center;
        color: $fontColor;
        font-size: $fs;
        font-family: Lato;
        font-weight: bold;
        input {
          & {
            width: 100%;
            flex: 1;
            color: #000;
            border: none;
            border-bottom: 2px solid #ff8a50;
            text-decoration: none;
            outline: none;
            background-color: transparent;
            font-family: Lato;
            font-weight: bold;
            font-size: $fs - 5px;
            transition: 0.2s ease;
            &:focus {
              border-bottom: 4px solid #ff8a50;
            }
          }
          &[type="checkbox"] {
            $size: 25px;
            border-radius: 50px;
            height: $size;
            width: $size;
            color: #000;
            background-color: #c4c4c4;
            cursor: pointer;
          }
        }
      }
    }
  }
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(225, 226, 225, 0.36);
    display: flex;
    flex-direction: column;
    .header {
      flex: 1;
      background-color: #e1e2e1;
    }
    .body {
      margin-right: $scrollbarSize;
      flex: 9;
      display: flex;
      flex-direction: row;
      .column {
        flex: 1;
      }
      .column:nth-of-type(2) {
        flex: 3;
      }
      .column:nth-of-type(4) {
        flex: 3;
      }
      .darker {
        background-color: rgba(225, 226, 225, 0.56);
      }
    }
  }
}
</style>
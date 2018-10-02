<template>
  <div class="actionsGrid">
    <div class="container">
      <div class="total">
        <div class="title">
          TOTAL:
        </div>
        <div class="value">
          $84.23
        </div>
      </div>
      <div class="method">
        <el-select v-model="payMethod" multiple placeholder="Seleccionar tipo de pago">
          <el-option
            label="Efectivo"
            :value="1">
          </el-option>
          <el-option
            label="Tarjeta de credito"
            :value="2 ">
          </el-option>
          <el-option
            label="Tarjeta de debito"
            :value="3">
          </el-option>
        </el-select>
      </div>
      <div class="actions">
        <button>
          Cancelar
        </button>
        <button>
          Simular
        </button>
        <button>
          Vender
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "sell-actions",
  data: () => ({
    payMethod: []
  })
});
</script>

<style lang="scss" scoped>
.actionsGrid {
  grid-area: actions;
  display: flex;
  overflow: hidden;
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #e1e2e1;
    padding: 0 5%;
    .total {
      flex: 2;
      display: flex;
      flex-direction: column;
      text-transform: uppercase;
      font-family: Lato;
      font-weight: bold;
      color: black;
      .title {
        flex: 1;
        font-size: 2.5em;
      }
      .value {
        flex: 1;
        font-size: 5em;
      }
    }
    .method {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      * {
        width: 100%;
      }
    }
    .actions {
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      button {
        flex: 1;
        margin: 0 4px;
        font-family: Lato;
        font-weight: bold;
        color: black;
        font-size: 20px;
        text-transform: uppercase;
        border: none;
        border-radius: 40px;
        height: 100%;
        height: 50px;
      }
      button:nth-of-type(1) {
        background-color: #c4c4c4;
      }
      button:nth-of-type(2) {
        background-color: #ff7043;
      }
      button:nth-of-type(3) {
        background-color: #c41c00;
      }
    }
  }
}
</style>
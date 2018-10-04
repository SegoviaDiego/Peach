<template>
  <div class="actionsGrid">
    <div class="container">
      <div class="total">
        <div class="title">
          TOTAL:
        </div>
        <div class="value">
          $ {{total}}
        </div>
      </div>
      <div class="method">
        <el-select v-model="payMethods" multiple placeholder="Seleccionar metodo de pago">
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
        <button @click="handleAction(1)">
          Cancelar
        </button>
        <button @click="handleAction(2)">
          Simular
        </button>
        <button @click="handleAction(3)">
          Vender
        </button>
      </div>
    </div>
    <!-- Dialog -->
    <el-dialog
      title="Seleccionar rango horario para la impresion"
      :visible.sync="payDivisionDialog"
      width="30%">
      <div>
        <template v-for="i of payMethods">
          {{getMethodLabel(i)}}
          <el-input
            :key="i"
            :min="0"
            type="number"
            :value="0"
            v-model="payDivision[i]"
            :placeholder="getMethodLabel(i)"/>
        </template>
        {{getPayDivisionMessage()}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payDivisionDialog = false">Cancelar</el-button>
        <el-button :disabled="this.total - this.getSubTotal() != 0" type="primary" @click="handleAction(3)">Vender</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { sell as types } from "@/vuexTypes";
import _ from "lodash";

import Print from "@/Server/Src/Print";

import { composeMagnitude } from "@/Server/mongodb/Utils";

export default Vue.extend({
  name: "sell-actions",
  computed: mapState({
    total(state: any) {
      if (!state.Sell.data) return (0).toFixed(2);
      let total = 0;
      for (let i in state.Sell.data) {
        total += state.Sell.data[i].money;
      }
      return total.toFixed(2);
    },
    sells: (state: any) => state.Sell.data,
    isLoading: (state: any) => state.Product.loading
  }),
  data: () => ({
    payDivisionDialog: false,
    payMethods: [],
    payDivision: {}
  }),
  methods: {
    getSubTotal() {
      let pd: any = this.payDivision;
      let subTotal: number = 0;
      for (let i in this.payDivision) {
        subTotal += parseFloat(pd[i]);
      }
      return subTotal;
    },
    getPayDivisionMessage() {
      let subTotal = this.total - this.getSubTotal();
      if (subTotal < 0) {
        return `La suma debe ser igual a cero! Actualemtne es ${subTotal}`;
      } else {
        return `Restante: ${subTotal}`;
      }
    },
    getMethodLabel(i: any) {
      switch (i) {
        case 1:
          return "Efectivo";
        case 2:
          return "Credito";
        case 3:
          return "Debito";
      }
    },
    print() {
      let printData = [];
      let total = 0;
      let sell;

      printData.push([
        { text: "PLU", style: "tableHeader" },
        { text: "NOMBRE", style: "tableHeader" },
        { text: "CANTIDAD", style: "tableHeader" },
        { text: "IMPORTE", style: "tableHeader" }
      ]);

      for (let i in this.sells) {
        sell = this.sells[i];
        printData.push([
          sell.item._id,
          sell.item.name,
          `${composeMagnitude(sell.amount, sell.item.type)}`,
          `$ ${sell.money.toFixed(2)}`
        ]);
      }

      Print.print({
        content: [
          {
            table: {
              headerRows: 1,
              dontBreakRows: true,
              keepWithHeaderRows: 1,
              widths: [50, "*", "20%", "20%"],
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
    },
    handleAction(type: number) {
      switch (type) {
        case 1: // Cancelar
          this.$store.dispatch(types.clearSells);
          break;
        case 2: // Simular
          this.print();
          break;
        case 3: // Vender
          if (this.payMethods.length == 0) {
            this.$notify({
              title: "No has seleccionado un metodo de pago",
              message:
                "Antes de realizar la venta debes elegir el metodo de pago",
              type: "warning",
              duration: 5000,
              offset: 170
            });
          } else if (_.isEmpty(this.sells)) {
            this.$notify({
              title: "No puedes realizar una venta vacia",
              message:
                "Antes de realizar la venta debes seleccionar los productos.",
              type: "warning",
              duration: 5000,
              offset: 170
            });
          } else if (this.payMethods.length > 1) {
            if (this.total - this.getSubTotal() == 0) {
              this.$store.dispatch(types.saveSell, {
                total: parseFloat(this.total),
                methods: this.payMethods,
                payDivision: this.payDivision
              });
              this.methods = [];
              this.payDivision = {};
              this.payDivisionDialog = false;
            } else {
              this.payDivisionDialog = true;
            }
          } else break;
      }
    }
  }
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
        cursor: pointer;
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
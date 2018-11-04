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
            value="efectivo">
          </el-option>
          <el-option
            label="Tarjeta de credito"
            value="credito">
          </el-option>
          <el-option
            label="Tarjeta de debito"
            value="debito">
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
      title="Dividir monto a pagar"
      :visible.sync="payDivisionDialog"
      width="30%">
      <!-- Dialog's body -->
      <div class="dialogBody">
        <template v-for="i of payMethods">
          <template v-if="i == 'credito'">
            <div :key="i" class="method">
              <div class="label">
                {{getMethodLabel(i)}}
              </div>
              <div class="input">
                <el-input
                  :key="i + 'division'"
                  :min="0"
                  type="number"
                  :value="payDivision[i]"
                  @input="handleDivisionChange(i, $event)"
                  :placeholder="getMethodLabel(i)"/>
                <el-input
                  :key="i + 'recargo'"
                  :min="0"
                  :max="100"
                  type="number"
                  v-model="recargoCredito"
                  placeholder="Recargo"/>
              </div>
            </div>
          </template>
          <template v-else>
            <div :key="i" class="method">
              <div class="label">
                {{getMethodLabel(i)}}
              </div>
              <div class="input">
                <el-input
                  :key="i"
                  :min="0"
                  type="number"
                  :value="payDivision[i]"
                  @input="handleDivisionChange(i, $event)"
                  :placeholder="getMethodLabel(i)"/>
              </div>
            </div>
          </template>

        </template>
        <!-- information -->
        <div class="restante">
          {{payDivisionMessage}}
        </div>
        <div class="recargo">
          Regargo: ${{getRecargo()}}
        </div>
        <div class="total">
          Total: ${{getTotal()}}
        </div>
        <!-- information -->
      </div>
      <!-- Dialog's body -->
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="payDivisionDialog = false">Cancelar</el-button>
        <el-button class="success" :disabled="this.total - this.getSubTotal() != 0" @click="handleAction(3)">Vender</el-button>
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
    payDivisionMessage: "",
    payDivisionDialog: false,
    payMethods: [],
    payDivision: {} as any,
    recargoCredito: null as any
  }),
  methods: {
    handleDivisionChange(id: any, amount: any) {
      amount = parseFloat(amount);
      if (!isNaN(amount)) {
        this.payDivision[id] = amount;
      } else {
        this.payDivision[id] = 0;
      }
      this.payDivisionMessage = this.getPayDivisionMessage();
    },
    getRecargo() {
      if (
        this.recargoCredito >= 0 &&
        this.recargoCredito <= 100 &&
        _.includes(this.payMethods, "credito")
      ) {
        return this.payDivision["credito"] * (this.recargoCredito / 100);
      }
      return 0;
    },
    getTotal() {
      let pd: any = this.payDivision;
      let subTotal: number = 0;
      for (let i in pd) {
        if (this.recargoCredito && i === "credito") {
          subTotal +=
            parseFloat(pd[i]) +
            (parseFloat(pd[i]) * (this.recargoCredito || 0)) / 100;
        } else {
          subTotal += parseFloat(pd[i]);
        }
      }
      return subTotal;
    },
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
        return `La suma debe ser igual a cero! Actualemtne es ${subTotal.toFixed(
          2
        )}`;
      } else {
        return `Restante: ${subTotal.toFixed(2)}`;
      }
    },
    getMethodLabel(i: any) {
      switch (i) {
        case "efectivo":
          return "Efectivo";
        case "credito":
          return "Credito";
        case "debito":
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

      for (let sell of _.toArray(this.sells)) {
        total += sell.money;

        printData.push([
          sell.item._id,
          sell.item.name,
          `${composeMagnitude(sell.amount, sell.item.type)}`,
          `$ ${sell.money.toFixed(2)}`
        ]);
      }

      printData.push([
        { text: "TOTAL", colSpan: 3, style: "tableHeader" },
        {},
        {},
        { text: `$ ${total.toFixed(2)}`, style: "tableHeader" }
      ]);

      Print.print({
        content: [
          {
            table: {
              headerRows: 2,
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
    clearSell() {
      this.$store.dispatch(types.clearSells);
      this.methods = [];
      this.payMethods = [];
      this.clearSellDialog();
    },
    clearSellDialog() {
      this.payDivision = {};
      this.recargoCredito = null;
      this.payDivisionDialog = false;
      this.payDivisionMessage = this.getPayDivisionMessage();
    },
    handleAction(type: number) {
      switch (type) {
        case 1: // Cancelar
          this.clearSell();
          break;
        case 2: // Simular
          this.print();
          break;
        case 3: // Vender
          if (!this.isReadyToSell()) return;
          if (
            this.payMethods.length > 1 ||
            _.includes(this.payMethods, "credito")
          ) {
            if (this.payDivisionDialog) {
              if (!this.validateSell()) return;

              for (const i in this.payDivision) {
                this.payDivision[i] = parseFloat(this.payDivision[i]);
              }

              this.$store
                .dispatch(types.saveSell, {
                  total: parseFloat(this.total),
                  payDivision: this.payDivision
                })
                .then(() => {
                  this.$notify({
                    title: "Se ha realizado la venta con éxito",
                    message: "",
                    type: "success",
                    duration: 2000,
                    offset: 80
                  });
                });

              this.clearSell();
            } else {
              this.clearSellDialog();
              this.payDivisionDialog = true;
            }
          } else {
            if (!this.isReadyToSell()) return;
            if (!this.validateSell()) return;

            this.payDivision = {
              [this.payMethods[0]]: parseFloat(this.total)
            };

            this.$store
              .dispatch(types.saveSell, {
                total: parseFloat(this.total),
                payDivision: this.payDivision
              })
              .then(() => {
                this.$notify({
                  title: "Se ha realizado la venta con éxito",
                  message: "",
                  type: "success",
                  duration: 2000,
                  offset: 80
                });
              });

            this.clearSell();
            break;
          }
      }
    },
    isReadyToSell() {
      if (this.payMethods.length == 0) {
        this.$notify({
          title: "No has seleccionado un metodo de pago",
          message: "Antes de realizar la venta debes elegir el metodo de pago",
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
      } else {
        return true;
      }
      return false;
    },
    validateSell() {
      if (_.includes(this.payMethods, "credito")) {
        if (
          !this.recargoCredito ||
          this.recargoCredito < 0 ||
          this.recargoCredito > 100
        ) {
          this.$notify({
            title: "Porcentaje de recargo incorrecto",
            message: "El valor del porcentaje debe estar entre 0 y 100.",
            type: "warning",
            duration: 5000,
            offset: 60
          });
          return false;
        }
      }
      for (let id in this.payDivision) {
        if (this.payDivision[id] == 0) {
          this.$notify({
            title: `El valor del ${id} es incorrecto`,
            message: `El valor del ${id} no puede ser 0`,
            type: "warning",
            duration: 5000,
            offset: 60
          });
          return false;
        }
        if (this.payDivision[id] < 0) {
          this.$notify({
            title: `El valor del ${id} es incorrecto`,
            message: `El valor del ${id} no puede ser negativo`,
            type: "warning",
            duration: 5000,
            offset: 60
          });
          return false;
        }
      }
      return false;
    }
  }
});
</script>

<style lang="scss" scoped>
.dialogBody {
  @media screen and (max-width: 799px) {
    padding: 0px 5%;
  }
  @media screen and (min-width: 800px) {
    padding: 0px 10%;
  }

  .method {
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
  .restante {
    color: black;
    font-size: 20px;
    font-weight: bold;
  }
  .recargo {
    color: black;
    font-size: 30px;
    font-weight: bold;
    text-align: right;
    text-transform: uppercase;
  }
  .total {
    text-transform: uppercase;
    color: black;
    font-size: 30px;
    font-weight: bold;
    text-align: right;
  }
}

.actionsGrid {
  grid-area: actions;
  display: flex;
  overflow: hidden;
  width: 100%;
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #e1e2e1;
    padding: 10px 5%;
    .total {
      flex: 1;
      display: flex;
      flex-direction: row;
      text-transform: uppercase;
      font-family: Lato;
      font-weight: bold;
      color: black;

      .title {
        flex: 1;
        font-size: 2.5em;
      }
      .value {
        flex: 2;
        font-size: 40px;
      }

      @media screen and (min-height: 500px) and (max-height: 999px) {
        .title {
          font-size: 2.5em;
        }
        .value {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2em;
        }
      }

      @media screen and (min-height: 1000px) {
        flex: 2;
        flex-direction: column;
        .title {
          flex: 1;
          font-size: 2.5em;
        }
        .value {
          flex: 1;
          font-size: 3em;
        }
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
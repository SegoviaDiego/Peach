<template>
  <div class="ticketGrid">
    <div class="container">
      <div class="item">
        <div class="amount">
          Cantidad
        </div>
        <div class="name">
          Producto
        </div>
        <div class="amount">
          Dinero
        </div>
      </div>
      <template v-for="sell in sells">
        <div :key="sell.item._id" class="item">
          <div class="amount">
            {{getSellAmount(sell.item._id)}}
          </div>
          <div class="name">
            {{sell.item.name}}
          </div>
          <div class="amount">
            $ {{(sell.money).toFixed(2)}}
          </div>
          <div class="action">
            <button @click="removeFromSell(sell.item._id)">
              <fontawesome icon="times" />
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { sell as types } from "@/vuexTypes";
import _ from "lodash";

import { composeMagnitude } from "@/Server/mongodb/Utils";

export default Vue.extend({
  name: "sell-ticket",
  computed: mapState({
    sells: (state: any) => state.Sell.data,
    isLoading: (state: any) => state.Product.loading
  }),
  methods: {
    composeMagnitude: composeMagnitude,
    getSellAmount(id: any) {
      if (this.sells[id]) return this.sells[id].amount;
      return 0;
    },
    removeFromSell(id: any) {
      this.$store.dispatch(types.removeFromSell, id);
    }
  }
});
</script>

<style lang="scss" scoped>
.ticketGrid {
  grid-area: ticket;
  display: flex;
  padding: 10px;
  background-color: #eeeeee;
  .container {
    flex: 1;
    padding: 0 10px;
    overflow-x: hidden;
    overflow-y: scroll;
    // Scrollbar
    $sbSize: 10px;
    $bFontColor: #a0a0a0;
    &::-webkit-scrollbar {
      width: $sbSize;
    }
    &::-webkit-scrollbar-track {
      background-color: #e1e2e1;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background: $bFontColor;
      border-radius: 10px;
    }
    .item {
      margin-bottom: 5px;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-family: Lato;
      font-weight: bold;
      font-size: 20px;
      color: black;
      .name {
        flex: 2;
      }
      .amount {
        flex: 1;
        padding-right: 20px;
        // text-align: end;
      }
      .action {
        button {
          cursor: pointer;
          $bSize: 25px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #c4c4c4;
          border: none;
          font-size: 20px;
          border-radius: 50%;
          width: $bSize;
          height: $bSize;
        }
      }
    }
  }
}
</style>
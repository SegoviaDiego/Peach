<template>
  <div class="ticketGrid">
    <OxyTable v-model="sells" class="table">
      <Row slot="row" slot-scope="sell">
        <Cell label="Producto" :colSpan="1" >
          {{sell.item.name}}
        </Cell>
        <Cell label="Cantidad" :colSpan="1" >
          {{getSellAmount(sell.item._id)}}
        </Cell>
        <Cell label="Total"  :colSpan="1" >
          ${{(sell.money).toFixed(2)}}
        </Cell>
        <!-- :colSpan="0.5" -->
        <Cell label="" colSpan="27px" class="buttonCell" >
          <button @click="removeFromSell(sell.item._id)">
            <fontawesome icon="times" />
          </button>
        </Cell>
      </Row>
    </OxyTable>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import _ from "lodash";
import { sell as types } from "@/vuexTypes";
import { composeMagnitude } from "@/api/Utils";
import OxyTable from "@/components/Table/index.vue";
import Row from "@/components/Table/Row.vue";
import Cell from "@/components/Table/Cell.vue";

export default Vue.extend({
  name: "sell-ticket",
  components: {
    OxyTable,
    Row,
    Cell
  },
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

<style lang="scss" >
.ticketGrid {
  grid-area: ticket;
  display: flex;
  padding: 10px;
  background-color: #eeeeee;
  .table {
    flex: 1;
    .headerCell {
      @media screen and (max-width: 899px) {
        font-size: 20px;
        padding-left: 0;
      }
      @media screen and (min-width: 900px) and (max-width: 999px) {
        font-size: 20px;
        padding-left: 1px;
      }
      @media screen and (min-width: 1000px) and (max-width: 1299px) {
        font-size: 20px;
        padding-left: 1px;
      }
      @media screen and (min-width: 1300px) {
        font-size: 20px;
        padding-left: 3px;
      }
    }
    .cell {
      @media screen and (max-width: 899px) {
        font-size: 18px;
        margin: 0;
      }
      @media screen and (min-width: 900px) and (max-width: 999px) {
        font-size: 18px;
        margin: 0 2px;
      }
      @media screen and (min-width: 1000px) and (max-width: 1299px) {
        font-size: 18px;
        margin: 0 2px;
      }
      @media screen and (min-width: 1300px) {
        font-size: 20px;
        margin: 0 5px;
      }
    }
    .buttonCell {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      button {
        $bSize: 25px;
        width: $bSize;
        height: $bSize;

        display: flex;
        justify-content: center;
        align-items: center;

        font-size: 20px;

        background-color: #c4c4c4;

        border-radius: 50%;
        border: none;

        cursor: pointer;
      }
    }
  }
}
</style>
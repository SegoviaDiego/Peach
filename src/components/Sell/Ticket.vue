<template>
  <div class="ticketGrid">
    <div class="container">
      <template v-for="i in 50">
        <div :key="i" class="item">
          <div class="name">
            Pan frances
          </div>
          <div class="amount">
            89
          </div>
          <div class="action">
            <button>
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

export default Vue.extend({
  name: "sell-ticket"
});
</script>

<style lang="scss" scoped>
.ticketGrid {
  grid-area: ticket;
  display: flex;
  .container {
    flex: 1;
    background-color: #eeeeee;
    padding: 10px;
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
        flex: 3;
      }
      .amount {
        flex: 1;
        padding-right: 20px;
        text-align: end;
      }
      .action {
        button {
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
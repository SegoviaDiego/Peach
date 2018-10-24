<template>
  <div class="grid">
    <div
      @click="setOutType(1)"
      :class="{'section': true, 'active': type === 1 }">
      <div class="title">
        Vencimiento
      </div>
      <div class="line"/>
    </div>
    <div
      @click="setOutType(2)"
      :class="{'section': true, 'active': type === 2 }">
      <div class="title">
        Reciclado
      </div>
      <div class="line"/>
    </div>
    <div
      @click="setOutType(3)"
      :class="{'section': true, 'active': type === 3 }">
      <div class="title">
        Transferencia
      </div>
      <div class="line"/>
    </div>
    <div
      @click="setOutType(4)"
      :class="{'section': true, 'active': type === 4 }">
      <div class="title">
        Todo
      </div>
      <div class="line"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

import { log as types } from "@/vuexTypes";

export default Vue.extend({
  name: "egresos-topbar",
  mounted() {},
  computed: mapState({
    isLoading: (state: any) => state.Log.loading,
    type: (state: any) => state.Log.type
  }),
  methods: {
    setOutType(type: number) {
      this.$store.dispatch(types.setType, type).then(() => {
        this.$store.dispatch(types.loadEgreso);
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.grid {
  grid-area: topbar;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  padding: 10px 0;
  .section {
    flex: 1;
    height: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    * {
      transition: 200ms;
    }
    &:hover .line,
    &.active .line {
      margin-top: 7px;
      background-color: #000;
      width: 60%;
      height: 5px;
    }
    .title {
      margin: 0;
      text-transform: capitalize;
      font-family: Lato;
      font-weight: bold;
      font-size: 25px;
      color: #000;
    }
    .line {
      margin-top: 5px;
      background-color: #a0a0a0;
      width: 30%;
      height: 3px;
    }
  }
}
</style>
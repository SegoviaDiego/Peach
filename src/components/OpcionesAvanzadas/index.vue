<template>
  <div class="optionsContainer">
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";

export default Vue.extend({
  name: "OpcionesAvanzadas"
});
</script>

<style lang="scss" scoped>
.optionsContainer {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
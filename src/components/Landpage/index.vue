<template>
  <div class="grid">
    Cargando
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "app-main"
});
</script>

<style lang="scss" scoped>
.grid {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100px;
}
</style>
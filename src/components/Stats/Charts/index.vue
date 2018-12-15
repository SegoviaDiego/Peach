<template>
  <div class="chartsGrid">
    <router-view/>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "Estadisticas"
});
</script>

<style lang="scss" scoped>
.chartsGrid {
  flex: 1;
  display: flex;
}
</style>
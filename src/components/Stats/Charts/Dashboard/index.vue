<template>
  <div class="ChartsDashboardGrid">
    <div @click="goTo('dailySell')" class="card dailySell">
      <div class="title">Ventas diarias</div>
      <div class="chart">
        <DailySell/>
      </div>
    </div>
    <div @click="goTo('monthlySell')" class="card monthlySell">
      <div class="title">Ventas por mes</div>
      <div class="chart">
        <MonthlySell/>
      </div>
    </div>
    <div @click="goTo('topProducts')" class="card topProducts">
      <div class="title">Productos más vendidos</div>
      <div class="chart">
        <TopProducts/>
      </div>
    </div>
    <div class="card lt">
      <div class="title">Ultimas transacciones</div>
      <div class="chart">
        <!-- <LastTransactions/> -->
      </div>
    </div>
    <div class="card pie">
      <div class="title">General</div>
      <div class="chart">
        <!-- <General/> -->
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";

import TopProducts from "@/components/Stats/Charts/TopProducts/chart.vue";
import DailySell from "@/components/Stats/Charts/DailySell/chart.vue";
import MonthlySell from "@/components/Stats/Charts/MonthlySell/chart.vue";
import General from "@/components/Stats/Charts/General/chart.vue";
import LastTransactions from "@/components/Stats/Charts/LastTransactions/chart.vue";

import { settings as types } from "@/vuexTypes";

export default Vue.extend({
  name: "Dashboard",
  components: {
    TopProducts,
    DailySell,
    MonthlySell,
    General,
    LastTransactions
  },
  methods: {
    goTo(route) {
      this.$router.replace({ path: route });
      this.$store.dispatch(types.setStatsRoute, route);
    }
  }
});
</script>

<style lang="scss" scoped>
.ChartsDashboardGrid {
  flex: 1;
  position: relative;
  display: grid;
  grid-gap: 25px;
  padding: 25px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "dailySell monthlySell topProducts"
    "lt lt pie";
  .card {
    cursor: pointer;
    padding: 10px;
    display: flex;
    flex-direction: column;
    border-radius: 13px;
    background-color: #eeeeee;
    overflow: hidden;
    .title {
      flex: 1;
      font-size: 20px;
      font-weight: bold;
    }
    .chart {
      flex: 9;
      display: flex;
      overflow: hidden;
    }
  }
  .dailySell {
    grid-area: dailySell;
  }
  .monthlySell {
    grid-area: monthlySell;
  }
  .topProducts {
    grid-area: topProducts;
  }
  .lt {
    grid-area: lt;
  }
  .pie {
    grid-area: pie;
  }
}
</style>
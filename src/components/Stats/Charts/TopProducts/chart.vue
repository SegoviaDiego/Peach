<template>
  <div class="topProductChartContainer">
    <BarChart :options="options" :chartData="datacollection"/>
  </div>
</template>

<script>
import Vue from "vue";
import _ from "lodash";
import { mapState } from "vuex";
import BarChart from "@/components/Stats/Charts/ChartTypes/BarChart.js";
import { chart as types } from "@/vuexTypes";

export default Vue.extend({
  name: "TopProducts",
  mounted() {
    let payload = { start: new Date(), end: new Date() };
    payload.start.setDate(1);
    payload.start.setHours(0, 0, 0, 0);
    payload.end.setDate(31);
    payload.end.setHours(0, 0, 0, 0);

    this.$store.dispatch(types.loadTopProducts, payload).then(() => {
      this.fillData();
    });
  },
  components: {
    BarChart
  },
  props: {
    width: [String, Number],
    height: [String, Number]
  },
  computed: mapState({
    data: state => state.Chart.topProducts
  }),
  data: () => ({
    datacollection: null,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            ticks: {
              minRotation: 90
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  }),
  methods: {
    async fillData() {
      const tp = this.data || [];
      const labels = [];
      const data = [];

      for (const el of tp) {
        labels.push(el.item.name);
        data.push(el.amount.toFixed(2));
      }

      this.datacollection = {
        labels,
        datasets: [
          {
            label: "Venta mensual",
            borderColor: "#f87979",
            borderWidth: 5,
            pointRadius: 13,
            pointBackgroundColor: "#f87979",
            pointHoverRadius: 13,
            pointHoverBackgroundColor: "#f87979",
            fill: false,
            data
          }
        ]
      };
    }
  }
});
</script>

<style lang="scss" >
.topProductsChartContainer {
  position: relative;
  flex: 1;
  *,
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
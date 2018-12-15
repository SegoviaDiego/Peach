<template>
  <div class="dailySellChartContainer">
    <LineChart :options="options" :chartData="datacollection"/>
  </div>
</template>

<script>
import Vue from "vue";
import _ from "lodash";
import { mapState } from "vuex";
import LineChart from "@/components/Stats/Charts/ChartTypes/LineChart.js";
import { chart as types } from "@/vuexTypes";

export default Vue.extend({
  name: "DailySell",
  mounted() {
    let payload = { start: new Date(), end: new Date() };
    payload.start.setDate(1);
    payload.start.setHours(0, 0, 0, 0);
    payload.end.setDate(31);
    payload.end.setHours(0, 0, 0, 0);

    this.$store.dispatch(types.loadDailySell, payload).then(() => {
      this.fillData();
    });
  },
  components: {
    LineChart
  },
  props: {
    width: [String, Number],
    height: [String, Number]
  },
  computed: mapState({
    data: state => state.Chart.dailySell
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
      const dailySell = this.data || [];
      const labels = [];
      const data = [];

      for (const el of dailySell) {
        labels.push(el.name);
        data.push(el.money.toFixed(2));
      }

      this.datacollection = {
        labels,
        datasets: [
          {
            lineTension: 0,
            label: "Venta diaria",
            borderColor: "#f87979",
            borderWidth: 5,
            pointBackgroundColor: "#f87979",
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
.dailySellChartContainer {
  position: relative;
  flex: 1;
  *,
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
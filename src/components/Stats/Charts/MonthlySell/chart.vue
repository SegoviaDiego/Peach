<template>
  <div class="monthlySellChartContainer" v-loading="loading">
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
  name: "MonthlySellChart",
  mounted() {
    this.loading = true;

    const day = new Date();
    let payload = {
      start: new Date(day.getFullYear(), 0, 1),
      end: new Date(day.getFullYear() + 1, 0, 1)
    };

    this.$store.dispatch(types.loadMonthlySell, payload).then(() => {
      this.loading = false;
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
    data: state => state.Chart.monthlySell
  }),
  data: () => ({
    loading: false,
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
.monthlySellChartContainer {
  position: relative;
  flex: 1;
  canvas,
  div {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
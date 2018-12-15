<template>
  <div class="topProductChartContainer">
    <BarChart :options="options" :chartData="datacollection"/>
  </div>
</template>

<script>
import Vue from "vue";
import _ from "lodash";
import { mapState } from "vuex";
import Client from "@/api/Client/Client";
import socketEvents from "@/socketEvents";
import BarChart from "@/components/Stats/Charts/ChartTypes/BarChart.js";

export default Vue.extend({
  name: "Estadisticas",
  mounted() {
    this.fillData();
  },
  components: {
    BarChart
  },
  props: {
    width: [String, Number],
    height: [String, Number]
  },
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
    async getData() {
      const start = new Date();
      const end = new Date();
      start.setDate(start.getDate() - 31);
      start.setHours(0, 0, 0, 0);

      let topProducts = _.toArray(
        await Client.get(socketEvents.Chart.topProducts, {
          start,
          end
        })
      );

      topProducts.sort((a, b) => {
        return b.amount - a.amount;
      });

      return topProducts.slice(0, 10);
    },
    async fillData() {
      const tp = await this.getData();
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
.topProductChartContainer {
  position: relative;
  flex: 1;
  *,
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
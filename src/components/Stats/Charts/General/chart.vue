<template>
  <div class="topProductChartContainer">
    <DoughnutChart :options="options" :chartData="datacollection"/>
  </div>
</template>

<script>
import Vue from "vue";
import _ from "lodash";
import { mapState } from "vuex";
import Client from "@/api/Client/Client";
import socketEvents from "@/socketEvents";
import DoughnutChart from "@/components/Stats/Charts/ChartTypes/DoughnutChart.js";

export default Vue.extend({
  name: "Estadisticas",
  mounted() {
    this.fillData();
  },
  components: {
    DoughnutChart
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
      legend: {
        display: false
      }
    }
  }),
  methods: {
    async getData() {
      const start = new Date();
      const end = new Date();
      start.setDate(start.getDate() - 31);
      start.setHours(0, 0, 0, 0);

      let data = _.toArray(
        await Client.get(socketEvents.Chart.general, {
          start,
          end
        })
      );

      return data;
    },
    async fillData() {
      const payload = await this.getData();
      const labels = [];
      const data = [];

      for (const el of payload) {
        labels.push(el.name);
        data.push(el.money.toFixed(2));
      }

      this.datacollection = {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ["#39B6D8", "#C41C00", "#F57F2B", "#FF7043"]
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
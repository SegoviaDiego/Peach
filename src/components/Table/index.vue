<template>
  <div class="table">
    <Header :headers="OxyTable.cols"/>
    <Body>
      <!-- Top row -->
      <RowContainer :isHeader="!sortedData.length">
        <slot name="firstRow"/>
      </RowContainer>

      <!-- Value vacio -->
      <template v-if="!sortedData.length"></template>
      <!-- Value con informacion -->
      <template v-else-if="!isLoading" v-for="(item, index) in sortedData">
        <RowContainer :key="index" :isHeader="index === 0">
          <slot name="row" v-bind="item"/>
        </RowContainer>
      </template>
    </Body>
    <Background/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";
import Header from "./Header.vue";
import Body from "./Body.vue";
import Background from "./Background.vue";
import RowContainer from "./RowContainer.vue";
import { setInterval } from "timers";

function getObjectAttribute(object: any, key: string) {
  let value = object;
  for (const attribute of key.split(".")) {
    value = value[attribute];
  }
  return value;
}

function sortData(data: any, sortBy: any, sortOrder: any, isNumber: any) {
  const isAsc = sortOrder === "asc";
  const isIntType = typeof getObjectAttribute(data[0], sortBy) === "number";
  if (isNumber || isIntType) {
    return [...data].sort((a: any, b: any) => {
      a = getObjectAttribute(a, sortBy);
      b = getObjectAttribute(b, sortBy);
      a = parseFloat(a);
      b = parseFloat(b);
      return isAsc ? a - b : b - a;
    });
  } else {
    return [...data].sort((a: any, b: any) => {
      a = getObjectAttribute(a, sortBy);
      b = getObjectAttribute(b, sortBy);
      a = ("" + a).toLowerCase();
      b = ("" + b).toLowerCase();

      return isAsc
        ? a.localeCompare(b, "kn", { sensitivity: "base" })
        : b.localeCompare(a, "kn", { sensitivity: "base" });
    });
  }
}

export default Vue.extend({
  name: "OxyTable",
  components: {
    Header,
    Body,
    Background,
    RowContainer
  },
  props: {
    value: [Array, Object]
  },
  provide() {
    return { OxyTable: this.OxyTable };
  },
  async mounted() {
    setTimeout(() => {
      (this as any).isLoading = false;
    }, 0);
  },
  data: () => ({
    isLoading: true,
    OxyTable: {
      cols: {},
      sortBy: null as any,
      isNumber: null as any,
      sortOrder: "desc",
      gridTemplate: null as any
    }
  }),
  computed: {
    sortedData() {
      const data = _.toArray(this.value);
      if ((this.OxyTable as any).sortBy) {
        return sortData(
          data,
          (this.OxyTable as any).sortBy,
          (this.OxyTable as any).sortOrder,
          (this.OxyTable as any).isNumber
        );
      } else {
        return data;
      }
    }
  },
  watch: {
    "OxyTable.cols"(cols) {
      let template = "";
      let value;

      _.each(cols, item => {
        if (isNaN(item.colSpan)) {
          template += `${item.colSpan} `;
        } else {
          template += `${item.colSpan}fr `;
        }
      });

      (this as any).OxyTable.gridTemplate = template;
    }
  }
});
</script>

<style lang="scss" scoped>
.table {
  position: relative;
  grid-area: table;
  display: grid;
  grid-template-rows: 1fr 9fr;
  grid-template-columns: 1fr;
  grid-template-areas: "header" "body";
  min-height: 0;
}
</style>

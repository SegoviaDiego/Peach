<template>
  <div class="lastTransactionsContainer">
    <OxyTable v-model="test">
      <Row slot="row" slot-scope="item">
        <Cell label="Hora" :colSpan="1" isNumber>20:50</Cell>
        <Cell label="Codigo" :colSpan="1" isNumber>asdasdsad</Cell>
      </Row>
    </OxyTable>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import _ from "lodash";

import OxyTable from "@/components/Table/index.vue";
import Row from "@/components/Table/Row.vue";
import Cell from "@/components/Table/Cell.vue";

export default Vue.extend({
  name: "LastTransactions",
  components: {
    OxyTable,
    Row,
    Cell
  },
  data: () => ({
    test: [{}, {}]
  })
});
</script>

<style lang="scss" >
.lastTransactionsContainer {
  position: relative;
  flex: 1;
}
</style>
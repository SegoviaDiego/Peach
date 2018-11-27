<template>
  <div class="headerCell" @click="sortBy()">
    <div class="label">{{item.label}}</div>
    <div class="sortIcon">
      <template v-if="item.sortBy === OxyTable.sortBy">
        <template v-if="OxyTable.sortOrder === 'asc'">
          <fontawesome icon="sort-up"/>
        </template>
        <template v-else>
          <fontawesome icon="sort-down"/>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "HeaderCell",
  inject: ["OxyTable"],
  props: {
    item: [Object]
  },
  methods: {
    sortBy() {
      if (this.item.sortBy) {
        if (this.OxyTable.sortBy === this.item.sortBy) {
          if (this.OxyTable.sortOrder === "asc") {
            this.$set(this.OxyTable, "sortOrder", "desc");
          } else {
            this.$set(this.OxyTable, "sortOrder", "asc");
          }
        }
        this.$set(this.OxyTable, "sortBy", this.item.sortBy);
        this.$set(this.OxyTable, "isNumber", this.item.isNumber);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.headerCell {
  flex: 1;
  height: 100%;

  padding-left: 10px;
  overflow: hidden;

  display: flex;
  align-items: center;
  flex-direction: row;

  font-family: Lato;
  font-weight: bold;
  color: black;

  cursor: pointer;
  transition: 100ms;

  // responsive
  @media screen and (max-width: 899px) {
    font-size: 16px;
  }
  @media screen and (min-width: 900px) and (max-width: 999px) {
    font-size: 20px;
  }
  @media screen and (min-width: 1000px) and (max-width: 1299px) {
    font-size: 25px;
  }
  @media screen and (min-width: 1300px) {
    font-size: 28px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .label {
    flex: 9;
  }
  .sortIcon {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
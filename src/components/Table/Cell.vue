<template>
  <div class="cell">
    <slot/>
  </div>
</template>

<script >
import Vue from "vue";
import _ from "lodash";

export default Vue.extend({
  name: "Cell",
  inject: ["OxyTable", "isHeader"],
  props: {
    label: String,
    sortBy: String,
    isNumber: Boolean,
    colSpan: [String, Number]
  },
  data: () => ({
    parentNode: null,
    index: null
  }),
  mounted() {
    this.parentNode = this.$el.parentNode;
    if (this.isHeader) this.updateCellData();
  },
  destroyed() {
    if (this.isHeader) {
      this.$delete(this.OxyTable.cols, this.index);
    }
  },
  methods: {
    updateCellData() {
      this.index = _.findIndex(this.parentNode.childNodes, cell => {
        return cell.__vue__.label == this.label;
      });

      this.$set(this.OxyTable.cols, this.index, {
        _id: this.index,
        label: this.label,
        isNumber: this.isNumber,
        sortBy: this.sortBy,
        colSpan: this.colSpan
      });
    }
  }
});
</script>

<style lang="scss" scoped>
@import "@/global.scss";

.cell {
  overflow: hidden;
  margin: 0 $scrollbarSize;

  display: flex;
  align-items: center;

  font-family: Lato;
  font-weight: bold;
  color: black;

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

  input {
    & {
      width: 100%;
      flex: 1;
      color: #000;
      border: none;
      border-bottom: 2px solid #ff8a50;
      text-decoration: none;
      outline: none;
      background-color: transparent;
      font-family: Lato;
      font-weight: bold;
      transition: 0.2s ease;
      &:focus {
        border-bottom: 4px solid #ff8a50;
      }
    }
  }
}
</style>
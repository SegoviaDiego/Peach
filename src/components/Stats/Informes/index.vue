<template>
  <div class="informesBox">
    <template v-if="!dateSelected">
      <div class="dateOptionsBox">
        <div @click="selectDate(1)" class="circleBtn">
          <div class="btnIcon">
            <fontawesome icon="calendar-check"/>
          </div>
          <div class="label">Hoy</div>
        </div>
        <div @click="selectDate(2)" class="circleBtn">
          <div class="btnIcon">
            <fontawesome icon="calendar-check"/>
          </div>
          <div class="label">Ayer</div>
        </div>
        <div @click="selectDate(3)" class="circleBtn">
          <div class="btnIcon">
            <fontawesome icon="calendar-check"/>
          </div>
          <div class="label">Seleccionar</div>
        </div>
      </div>
      <!-- Dialog -->
      <el-dialog title="Seleccionar fecha" :visible.sync="selectingDate" width="50%">
        <div>
          <el-date-picker
            v-model="selectedDate"
            format="dd/MM/yyyy"
            type="date"
            placeholder="Seleccionar dia"
            :picker-options="datePickOptions"
          ></el-date-picker>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="selectingDate = false">Cancelar</el-button>
          <el-button type="primary" @click="setDate()">Aceptar</el-button>
        </span>
      </el-dialog>
    </template>
    <template v-else>
      <div class="indexGrid">
        <Table/>
        <Sidebar/>
      </div>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import Toolbar from "./Toolbar.vue";
import Table from "./Table.vue";
import Sidebar from "./Sidebar.vue";
import { totals as types, log as logTypes } from "@/vuexTypes";

export default Vue.extend({
  name: "informes",
  components: {
    Toolbar,
    Table,
    Sidebar
  },
  mounted() {
    // this.$store.dispatch(types.load);
    this.$store.dispatch(logTypes.loadIngreso);
    this.$store.dispatch(logTypes.loadEgreso);
    this.$store.dispatch(logTypes.loadMov);
  },
  computed: mapState({
    isLoading: state => state.Total.loading
  }),
  data: () => ({
    dateSelected: false,
    selectingDate: false,
    selectedDate: null,
    datePickOptions: {
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      shortcuts: [
        {
          text: "Hoy",
          onClick(picker) {
            picker.$emit("pick", new Date());
          }
        },
        {
          text: "Ayer",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit("pick", date);
          }
        },
        {
          text: "Semana pasada",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", date);
          }
        }
      ]
    }
  }),
  methods: {
    selectDate(i) {
      switch (i) {
        case 1:
          this.selectedDate = new Date();
          this.setDate();
          break;
        case 2:
          let date = new Date();
          date.setDate(date.getDate() - 1);

          this.selectedDate = date;
          this.setDate();
          break;
        case 3:
          this.selectingDate = true;
          break;
        default:
      }
    },
    setIndex(index) {
      this.$store.dispatch(types.setCierreIndex, index);
    },
    async setDate() {
      await this.$store.dispatch(types.setDate, this.selectedDate);
      await this.$store.dispatch(logTypes.setDate, this.selectedDate);
      await this.$store.dispatch(types.load);
      await this.$store.dispatch(logTypes.loadIngreso);
      await this.$store.dispatch(logTypes.loadEgreso);
      await this.$store.dispatch(logTypes.loadMov);
      this.selectingDate = false;
      this.dateSelected = true;
    }
  }
});
</script>

<style lang="scss" scoped>
.dateDialog {
  overflow: visible;
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: visible;
  }
}
.informesBox {
  flex: 1;
  position: relative;
  display: flex;
  overflow: hidden;
  .dateOptionsBox {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    .circleBtn {
      margin: 0 20px;
      width: 25vw;
      height: 25vw;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background: red;
      cursor: pointer;
      transition: 200ms;
      &:hover {
        background: orange;
        .btnIcon {
          font-size: 10em;
        }
      }
      .btnIcon {
        // flex: 1;
        color: white;
        font-size: 8em;
      }
      .label {
        // flex: 1;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        color: white;
        font-size: 20pt;
        font-weight: bold;
      }
    }
  }
  .indexGrid {
    flex: 1;
    position: relative;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 3fr 1fr;
    grid-template-areas: "table sidebar";
    grid-gap: 10px;
    overflow: hidden;
    padding: 20px 40px;
  }
}
</style>
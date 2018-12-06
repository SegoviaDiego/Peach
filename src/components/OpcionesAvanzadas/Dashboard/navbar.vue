<template>
  <div class="opcionesAvanzadasNavbarFlex">
    <div class="container">
      <div class="buttons">
        <!-- Go back button -->
        <button @click="goBack">Volver atras</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "OpcionesAvanzadas-navbar",
  methods: {
    goBack() {
      this.$router.replace({ path: "/Stock" });
    }
  }
});
</script>

<style lang="scss" scoped>
.opcionesAvanzadasNavbarFlex {
  flex: 1;
  grid-area: navbar;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
}
button {
  color: black;
  background-color: #fdd835;
  height: 55px;
  min-width: 130px;
  border: none;
  padding: 15px 20px;
  text-decoration: none;
  text-transform: uppercase;
  border-radius: 40px;
  font-family: Lato;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: 300ms;
  &:hover {
    color: #ff5722;
  }
}
</style>
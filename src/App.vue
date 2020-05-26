<script>
import MainTimer from "./components/MainTimer.vue";
import "./App.css";

export default {
  name: "App",
  components: {
    MainTimer,
  },
};
</script>

<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <main-timer msg="Welcome to Your Vue.js App" />
  </div>
</template>

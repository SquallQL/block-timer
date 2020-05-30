<script>
import { mapGetters } from "vuex";

import MainTimer from "./components/header/MainTimer.vue";
import MainTimerDetails from "./components/header/MainTimerDetails.vue";
import TotalTimer from "./components/TotalTimer.vue";
import TimerSetup from "./components/TimerSetup.vue";
import AddTimerBtn from "./components/AddTimerBtn.vue";

import "./App.css";

export default {
  name: "App",
  components: {
    TotalTimer,
    MainTimer,
    MainTimerDetails,
    TimerSetup,
    AddTimerBtn,
  },
  computed: {
    ...mapGetters(["timers"]),
  },
};
</script>

<template>
  <div id="app">
    <total-timer />
    <main-timer-details />
    <main-timer />
    <div>
      <timer-setup
        v-for="(timer, index) in timers"
        :timer="timer"
        :index="index"
        :key="index"
      />
    </div>
    <add-timer-btn />
  </div>
</template>

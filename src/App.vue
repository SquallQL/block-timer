<script>
import { mapGetters } from "vuex";

import MainTimer from "./components/header/MainTimer.vue";
import MainTimerDetails from "./components/header/MainTimerDetails.vue";
import TotalTimer from "./components/TotalTimer.vue";
import TimerSetup from "./components/timer-setup/TimerSetup.vue";
import AddTimerBtn from "./components/AddTimerBtn.vue";

import "./App.css";

export default {
  name: "App",
  components: {
    AddTimerBtn,
    MainTimer,
    MainTimerDetails,
    TimerSetup,
    TotalTimer,
  },
  computed: {
    ...mapGetters(["currentRun", "timers"]),
  },
};
</script>

<template>
  <div id="app">
    <div class="total-timer-container">
      <total-timer />
    </div>
    <main-timer-details />
    <main-timer />
    <div class="timer-setup-section">
      <timer-setup
        v-for="(timer, index) in timers"
        :key="timer.uid"
        :timer="timer"
        :index="index"
      />
    </div>
    <add-timer-btn />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import MainTimer from "./components/main-timer/MainTimer.vue";
import WorkoutBanner from "./components/header/WorkoutBanner.vue";
import TimerSetup from "./components/timer-setup/TimerSetup.vue";
import AddTimerBtn from "./components/main-timer/AddTimerBtn.vue";

import "./App.css";

export default {
  name: "App",
  components: {
    AddTimerBtn,
    MainTimer,
    TimerSetup,
    WorkoutBanner,
  },
  computed: {
    ...mapGetters(["timers"]),
  },
};
</script>

<template>
  <div id="app">
    <div class="total-timer-container">
      <workout-banner />
    </div>
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

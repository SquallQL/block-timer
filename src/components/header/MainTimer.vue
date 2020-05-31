<script>
import { mapGetters, mapActions } from "vuex";
import "./MainTimer.css";

export default {
  name: "MainTimer",
  props: {},
  computed: {
    ...mapGetters(["currentRun", "currentRunningTimer", "timers"]),
    isActive() {
      return this.currentRun.isActive;
    },
    time() {
      if (!this.isActive) {
        return "00:00";
      }

      return this.currentRun.time;
    },
  },
  methods: {
    ...mapActions([
      "TimerSetup",
      "removeTimer",
      "setActiveTime",
      "setRestTime",
    ]),
  },
};
</script>

<template>
  <div>
    <h1 class="timer">{{ time }}</h1>
  </div>
</template>

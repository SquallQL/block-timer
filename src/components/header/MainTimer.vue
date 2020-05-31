<script>
import { mapGetters, mapActions } from "vuex";
import "./MainTimer.css";

export default {
  name: "MainTimer",
  data() {
    return {
      countdown: 0,
      intervalObject: null,
    };
  },
  watch: {
    isActive(flag) {
      clearInterval(this.intervalObject);

      if (flag) {
        this.countdown = this.currentRun.time;

        this.intervalObject = setInterval(() => {
          this.countdown -= 1;
          this.addTotalTime();
        }, 1000);
      }
    },
  },
  computed: {
    ...mapGetters(["currentRun", "currentRunningTimer", "timers"]),
    isActive() {
      return this.currentRun.isActive;
    },
    time() {
      if (!this.isActive) {
        return "00:00";
      }

      return this.countdown;
    },
  },
  methods: {
    ...mapActions([
      "TimerSetup",
      "removeTimer",
      "setActiveTime",
      "setRestTime",
      "addTotalTime",
    ]),
  },
};
</script>

<template>
  <div>
    <h1 class="timer">{{ time }}</h1>
  </div>
</template>

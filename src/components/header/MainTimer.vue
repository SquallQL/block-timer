<script>
import { mapGetters, mapActions } from "vuex";
import "./MainTimer.css";

export default {
  name: "MainTimer",
  data() {
    return {
      countdown: 0,
      count: null,
    };
  },
  watch: {
    isActive(flag) {
      clearInterval(this.count);

      if (flag) {
        this.countdown = this.currentRun.time;

        this.count = setInterval(() => {
          this.countdown -= 1;
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
    ]),
  },
};
</script>

<template>
  <div>
    <h1 class="timer">{{ time }}</h1>
  </div>
</template>

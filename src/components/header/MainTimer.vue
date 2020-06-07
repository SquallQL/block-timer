<script>
import { mapGetters, mapActions } from "vuex";
import "./MainTimer.css";

export default {
  name: "MainTimer",
  data() {
    return {
      countdown: null,
      intervalObject: null,
      intervalState: "active",
    };
  },
  computed: {
    ...mapGetters(["currentRun", "currentRunningTimer", "timers"]),
    isActive() {
      return this.currentRun.isActive;
    },
    isInterval() {
      return this.currentRunningTimer.isInterval;
    },
    isGettingReady() {
      return this.isActive && this.isInterval && this.intervalState === "ready";
    },
    isActiveTime() {
      return (
        this.isActive && this.isInterval && this.intervalState === "active"
      );
    },
    isRestTime() {
      return this.isActive && this.isInterval && this.intervalState === "rest";
    },
    time() {
      if (!this.isActive) {
        return "00:00";
      }

      if (this.countdown < 10) {
        return `0${this.countdown}`;
      }

      return this.countdown;
    },
  },
  watch: {
    isActive(flag) {
      clearInterval(this.intervalObject);

      if (flag) {
        this.intervalState = "ready";

        this.countdown = 3;

        this.intervalObject = setInterval(() => {
          this.countdown -= 1;
        }, 1000);
      }
    },
    countdown(val) {
      if (val === 0) {
        if (this.isInterval) {
          switch (this.intervalState) {
            case "ready":
              this.intervalState = "active";
              this.countdown = this.currentRunningTimer.active;
              break;

            case "active":
              this.intervalState = "rest";
              this.countdown = this.currentRunningTimer.rest;
              break;

            default:
              this.intervalState = "active";
              this.countdown = this.currentRunningTimer.active;

              if (this.currentRun.cycle < this.currentRunningTimer.cycle) {
                this.addCycle();
              }
              break;
          }
        } else {
          this.countdown = this.currentRunningTimer.active;
          this.addCycle();
        }
      }
    },
  },
  methods: {
    ...mapActions([
      "TimerSetup",
      "removeTimer",
      "setActiveTime",
      "setRestTime",
      "addTotalTime",
      "addCycle",
    ]),
  },
};
</script>

<template>
  <div class="main-timer-root">
    <h2 v-if="isGettingReady" class="getting-ready-text">Get ready in:</h2>
    <h1
      class="timer"
      :class="{ 'active-time': isActiveTime, 'rest-time': isRestTime }"
    >
      {{ time }}
    </h1>
  </div>
</template>

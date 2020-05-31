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

      return this.countdown;
    },
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
    countdown(val) {
      if (val === 0) {
        if (this.isInterval) {
          if (this.intervalState === "active") {
            this.intervalState = "rest";
            this.countdown = this.currentRunningTimer.rest;
          } else {
            this.intervalState = "active";
            this.countdown = this.currentRunningTimer.active;

            if (this.currentRun.cycle < this.currentRunningTimer.cycle) {
              this.addCycle();
            }
          }
        } else {
          this.countdown = this.currentRunningTimer.active;
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
  <div>
    <h1
      class="timer"
      :class="{ 'active-time': isActiveTime, 'rest-time': isRestTime }"
    >
      {{ time }}
    </h1>
  </div>
</template>

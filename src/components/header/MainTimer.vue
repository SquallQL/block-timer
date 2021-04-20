<script>
import { mapGetters, mapActions } from "vuex";
import PlayerControl from "./PlayerControl.vue";

import {
  ACTIVE_STATE,
  REST_STATE,
  READY_STATE,
} from "../../constants/constants";
import "./MainTimer.css";

export default {
  name: "MainTimer",
  components: {
    PlayerControl,
  },
  data() {
    return {
      countdown: null,
      intervalObject: null,
      shouldRewind: false,
    };
  },
  computed: {
    ...mapGetters(["currentRun", "currentRunningTimer", "timers"]),
    isActive() {
      return this.currentRun.isActive;
    },
    isPaused() {
      return this.currentRun.isPaused;
    },
    isInterval() {
      return this.currentRunningTimer.isInterval;
    },
    totalCycle() {
      return this.currentRunningTimer.cycle;
    },
    currentRunState() {
      return this.currentRun.state;
    },
    isGettingReady() {
      return this.isActive && this.currentRunState === READY_STATE;
    },
    isActiveTime() {
      return (
        this.isActive &&
        this.isInterval &&
        this.currentRunState === ACTIVE_STATE
      );
    },
    isDone() {
      const isLastRestRep =
        this.isRestTime && this.currentRun.cycle === this.totalCycle - 1;

      return (
        !this.isInfinite &&
        (this.currentRun.cycle >= this.totalCycle || isLastRestRep)
      );
    },
    isRestTime() {
      return (
        this.isActive && this.isInterval && this.currentRunState === REST_STATE
      );
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
    shouldRewind(flag) {
      if (flag) {
        this.countdown = this.currentRunningTimer[this.currentRunState];
        this.shouldRewind = false;
      }
    },
    isDone(flag) {
      if (flag) {
        this.stopTimer();
        this.resetCycle();
      }
    },
    isActive(flag) {
      clearInterval(this.intervalObject);

      if (flag) {
        this.setCurrentRunState(READY_STATE);

        this.countdown = 3;

        this.intervalObject = setInterval(() => {
          if (!this.isPaused) {
            this.countdown -= 1;
          }
        }, 1000);
      }
    },
    countdown(val) {
      if (val === 0) {
        const sound = document.getElementById("beep_long");

        sound.pause();
        sound.currentTime = 0;
        sound.play();

        switch (this.currentRunState) {
          case READY_STATE:
            this.setCurrentRunState(ACTIVE_STATE);
            this.countdown = this.currentRunningTimer.active;
            break;

          case ACTIVE_STATE:
            if (this.isInterval) {
              this.setCurrentRunState(REST_STATE);

              this.countdown = this.currentRunningTimer.rest;
            } else {
              this.countdown = this.currentRunningTimer.active;
              this.addCycle();
            }
            break;

          case REST_STATE:
            this.setCurrentRunState(ACTIVE_STATE);

            this.countdown = this.currentRunningTimer.active;

            if (this.currentRun.cycle < this.currentRunningTimer.cycle) {
              this.addCycle();
            }
            break;
        }
      } else if (val <= 3) {
        const sound = document.getElementById("beep_short");
        sound.pause();
        sound.currentTime = 0;
        sound.play();
      }
    },
  },
  methods: {
    ...mapActions([
      "addCycle",
      "addTotalTime",
      "removeTimer",
      "resetCycle",
      "setActiveTime",
      "setRestTime",
      "setCurrentRunState",
      "stopTimer",
      "TimerSetup",
    ]),
  },
};
</script>

<template>
  <div class="main-timer-root">
    <h1
      class="timer"
      :class="{ 'active-time': isActiveTime, 'rest-time': isRestTime }"
    >
      {{ time }}
    </h1>
    <player-control v-if="isActive" @rewind="shouldRewind = true" />
  </div>
</template>

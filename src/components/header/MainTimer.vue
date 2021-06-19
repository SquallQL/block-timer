<script>
import { mapGetters, mapActions } from "vuex";
import PlayerControl from "./PlayerControl.vue";

import {
  ACTIVE_STATE,
  REST_STATE,
  READY_STATE,
} from "../../constants/constants";
import "./MainTimer.css";

const SHORT_BEEP_ID = "beep_short";
const LONG_BEEP_ID = "beep_long";
const COUNTDOWN_DEFAULT_VAL = 3;

export default {
  name: "MainTimer",
  components: {
    PlayerControl,
  },
  data() {
    return {
      countdown: COUNTDOWN_DEFAULT_VAL,
      intervalObject: null,
      shouldRewind: false,
      skipNextSound: false,
    };
  },
  computed: {
    ...mapGetters(["currentRun", "currentRunningTimer", "timers"]),
    cycleText() {
      return this.isInfinite
        ? String(this.currentRun.cycle + 1)
        : `${this.currentRun.cycle + 1}/${this.currentRunningTimer.cycle}`;
    },
    isActive() {
      return this.currentRun.isActive;
    },
    isPaused() {
      return this.currentRun.isPaused;
    },
    isInfinite() {
      return this.currentRunningTimer.isInfinite;
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
        this.isActive &&
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
        this.toggleWorkoutStarted();
      }
    },
    isActive(flag) {
      clearInterval(this.intervalObject);

      if (flag) {
        this.setCurrentRunState(READY_STATE);

        this.resetCountdown();
        this.playSound(SHORT_BEEP_ID);

        this.intervalObject = setInterval(() => {
          if (!this.isPaused) {
            this.countdown -= 1;
          }
        }, 1000);
      }
    },
    countdown(val) {
      // We only ever want to skip sound once, and that's when we just
      // switched from on state to another, we don't want an overlapping
      // short and long sound
      if (this.skipNextSound) {
        this.skipNextSound = false;
        return;
      }

      if (val === 0) {
        this.playSound(LONG_BEEP_ID);
        this.skipNextSound = true;
        this.changeTimerState();
      } else if (val <= 3 && !this.skipNextSound) {
        this.playSound(SHORT_BEEP_ID);
      }
    },
  },
  methods: {
    ...mapActions([
      "addCycle",
      "addTotalTime",
      "removeTimer",
      "resetCycle",
      "setCurrentRunState",
      "toggleWorkoutStarted",
      "stopTimer",
      "TimerSetup",
    ]),
    changeTimerState() {
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
    },

    playSound(id) {
      const sound = document.getElementById(id);

      sound.pause();
      sound.currentTime = 0;
      sound.play();
    },
    resetCountdown() {
      this.countdown = COUNTDOWN_DEFAULT_VAL;
    },
  },
};
</script>

<template>
  <div class="main-timer-root">
    <h3 v-if="isGettingReady" class="getting-ready">
      Get ready in:
    </h3>
    <div class="main-timer-container">
      <h1
        class="timer"
        :class="{ 'active-time': isActiveTime, 'rest-time': isRestTime }"
      >
        {{ time }}
      </h1>
      <h3 v-if="isActive && !isGettingReady" class="cycle-count">
        {{ cycleText }}
      </h3>
    </div>
    <player-control v-if="isActive" @rewind="shouldRewind = true" />
  </div>
</template>

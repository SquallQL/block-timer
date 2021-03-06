<script>
import { mapGetters, mapActions } from "vuex";
import PlayerControl from "./PlayerControl.vue";
import hideDirective from "../../hideDirective.js";

import {
  ACTIVE_STATE,
  REST_STATE,
  READY_STATE,
  SHORT_BEEP_ID,
  LONG_BEEP_ID,
  END_BEEP_ID,
  COUNTDOWN_DEFAULT_VAL,
} from "../../constants/constants";
import "./MainTimer.css";

export default {
  name: "MainTimer",
  components: {
    PlayerControl,
  },
  directives: {
    hideDirective,
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
    ...mapGetters(["currentRun", "currentTimerSettings", "timers"]),
    cycleText() {
      return this.isInfinite
        ? `${this.currentRun.cycle + 1}/∞`
        : `${this.currentRun.cycle + 1}/${this.currentTimerSettings.cycle}`;
    },
    isActive() {
      return this.currentRun.isActive;
    },
    isPaused() {
      return this.currentRun.isPaused;
    },
    isInfinite() {
      return this.currentTimerSettings.isInfinite;
    },
    isInterval() {
      return this.currentTimerSettings.isInterval;
    },
    totalCycle() {
      return this.currentTimerSettings.cycle;
    },
    currentRunState() {
      return this.currentRun.state;
    },
    isGettingReady() {
      return this.isActive && this.currentRunState === READY_STATE;
    },
    isTimerRunning() {
      return this.isActive || this.isGettingReady;
    },
    isActiveTime() {
      return (
        this.isActive &&
        this.isInterval &&
        this.currentRunState === ACTIVE_STATE
      );
    },
    isDone() {
      return this.isActive && !this.isInfinite && this.isLastRep;
    },
    isLastRep() {
      return (
        (this.isRestTime && this.currentRun.cycle === this.totalCycle - 1) ||
        this.currentRun.cycle >= this.totalCycle
      );
    },
    isRestTime() {
      return (
        this.isActive && this.isInterval && this.currentRunState === REST_STATE
      );
    },
    time() {
      if (this.countdown < 10) {
        return `0${this.countdown}`;
      }

      return this.countdown;
    },
  },
  watch: {
    shouldRewind(flag) {
      if (flag) {
        this.countdown = this.currentTimerSettings[this.currentRunState];
        this.shouldRewind = false;
      }
    },
    isDone(flag) {
      if (flag) {
        this.stopTimer();
        this.resetCycle();
        this.stopWorkout();
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
        this.changeTimerState();
        this.skipNextSound = true;

        if (this.isLastRep) {
          this.playSound(END_BEEP_ID);
        } else {
          this.playSound(LONG_BEEP_ID);
        }
      } else if (val <= 3 && !this.skipNextSound) {
        this.playSound(SHORT_BEEP_ID);
      }
    },
  },
  methods: {
    ...mapActions([
      "addCycle",
      "addTotalTime",
      "setCurrentRunState",
      "stopTimer",
      "removeTimer",
      "resetCycle",
      "stopWorkout",
    ]),
    changeTimerState() {
      switch (this.currentRunState) {
        case READY_STATE:
          this.setCurrentRunState(ACTIVE_STATE);
          this.countdown = this.currentTimerSettings.active;
          break;

        case ACTIVE_STATE:
          if (this.isInterval) {
            this.setCurrentRunState(REST_STATE);

            this.countdown = this.currentTimerSettings.rest;
          } else {
            this.countdown = this.currentTimerSettings.active;
            this.addCycle();
          }
          break;

        case REST_STATE:
          this.setCurrentRunState(ACTIVE_STATE);

          this.countdown = this.currentTimerSettings.active;

          if (this.currentRun.cycle < this.currentTimerSettings.cycle) {
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
    <h3
      v-hide="!isGettingReady"
      class="getting-ready"
      data-testId="getting-ready"
    >
      Get ready in
    </h3>
    <div v-if="isTimerRunning" class="timer-area">
      <h1
        class="timer"
        :class="{ 'active-time': isActiveTime, 'rest-time': isRestTime }"
        data-testId="active-time"
      >
        {{ time }}
      </h1>
      <h3
        class="cycle-count"
        :class="{ 'cycle-count-visible': !isGettingReady }"
        data-testId="cycle-count"
      >
        {{ cycleText }}
      </h3>
    </div>
    <h1 v-else class="timer timer-mobile">00:00</h1>
    <div class="player-control-wrapper">
      <player-control
        :class="{
          'active-control-player': isActive,
          'control-player': !isActive,
        }"
        @rewind="shouldRewind = true"
      />
    </div>
  </div>
</template>

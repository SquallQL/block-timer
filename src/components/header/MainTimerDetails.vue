<script>
import "./MainTimerDetails.css";
import { mapGetters } from "vuex";
import {
  READY_STATE,
  REST_STATE,
  ACTIVE_STATE,
} from "../../constants/constants";

export default {
  computed: {
    ...mapGetters(["currentRunningTimer", "currentRun"]),
    isInterval() {
      return this.currentRunningTimer.isInterval;
    },
    isActiveTime() {
      return this.isInterval && this.currentRun.state === ACTIVE_STATE;
    },
    isRestTime() {
      return this.isInterval && this.currentRun.state === REST_STATE;
    },
    isInfinite() {
      return this.currentRunningTimer.isInfinite;
    },
    isGettingReady() {
      return this.currentRun.isActive && this.currentRun.state === READY_STATE;
    },
    cycleText() {
      return this.isInfinite
        ? String(this.currentRun.cycle + 1)
        : `${this.currentRun.cycle + 1}/${this.currentRunningTimer.cycle}`;
    },
  },
};
</script>

<template>
  <div v-if="currentRun.isActive" class="details-root">
    <div v-if="isGettingReady">
      <h3 class="details-text">Get ready in:</h3>
    </div>
    <div v-else>
      <h3
        class="details-text"
        :class="{ 'active-time': isActiveTime, 'rest-time': isRestTime }"
      >
        Cycle: {{ cycleText }}
      </h3>
    </div>
  </div>
</template>

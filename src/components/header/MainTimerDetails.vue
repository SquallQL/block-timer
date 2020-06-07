<script>
import "./MainTimerDetails.css";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["currentRunningTimer", "currentRun"]),
    isInterval() {
      return this.currentRunningTimer.isInterval;
    },
    isInfinite() {
      return this.currentRunningTimer.isInfinite;
    },
    isActive() {
      return this.currentRun.isActive;
    },
    activeText() {
      return this.isInterval ? "Active: " : "Time: ";
    },
  },
  watch: {
    currentRunningTimer(val) {
      console.log(val);
    },
  },
};
</script>

<template>
  <div class="details-root" :class="{ 'details-hidden': !isActive }">
    <span :class="{ 'active-time': isInterval }">
      <span>{{ activeText }}</span>
      <span v-if="isActive">{{ currentRunningTimer.active }}</span>
      <span v-else>-</span>
    </span>
    <span v-if="isInterval">
      <span class="details-spacer">|</span>
      <span class="rest-time">
        <span>Rest: </span>
        <span v-if="isActive">{{ currentRunningTimer.rest }}</span>
        <span v-else>-</span>
      </span>
    </span>
    <span>
      <span class="details-spacer">|</span>
      <span>Cycle: </span>
      <span v-if="isInfinite">{{ currentRun.cycle + 1 }}</span>
      <span v-else>
        <template v-if="isActive">
          {{ currentRun.cycle + 1 }}/{{ currentRunningTimer.cycle }}
        </template>
        <template v-else>
          -/-
        </template>
      </span>
    </span>
  </div>
</template>

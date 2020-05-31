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
      return this.isInterval || !this.isActive ? "Active: " : "Time: ";
    },
  },
};
</script>

<template>
  <div class="details-root">
    <span :class="{ 'active-time': isInterval || !isActive }">
      <span>{{ activeText }}</span>
      <span v-if="isActive">{{ currentRunningTimer.active }}</span>
      <span v-else>-</span>
    </span>
    <span v-if="isInterval || !isActive">
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
      <span v-if="isInfinite && isActive">&#8734;</span>
      <span v-else>
        <template v-if="isActive">
          {{ currentRun.cycle }}/{{ currentRunningTimer.cycle }}
        </template>
        <template v-else>
          -/-
        </template>
      </span>
    </span>
  </div>
</template>

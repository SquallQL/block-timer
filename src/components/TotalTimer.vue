<script>
import "./TotalTimer.css";
import { mapGetters, mapActions } from "vuex";
import { formatTime } from "../util/timeUtils";
import ArrowCircle from "./icon/ArrowCircle.vue";

export default {
  name: "TotalTimer",
  components: {
    ArrowCircle,
  },
  data() {
    return {
      intervalObject: null,
      totalTime: 0,
    };
  },
  computed: {
    ...mapGetters(["isWorkoutStarted"]),
    btnText() {
      return this.isWorkoutStarted ? "Finish Workout" : "Start Workout";
    },
    formattedTime() {
      return formatTime(this.totalTime);
    },
  },
  methods: {
    ...mapActions(["toggleWorkoutStarted"]),
    toggleTotalTimer() {
      if (this.intervalObject && this.isWorkoutStarted) {
        clearInterval(this.intervalObject);
      } else {
        this.intervalObject = setInterval(() => {
          this.totalTime += 1;
        }, 1000);
      }

      this.toggleWorkoutStarted();
    },
    resetTimer() {
      if (confirm("Do you want to restart your total workout time?")) {
        if (this.isWorkoutStarted) {
          this.toggleTotalTimer();
        }

        this.totalTime = 0;
      }
    },
  },
  watch: {
    isWorkoutStarted(flag) {
      if (flag && !this.intervalObject) {
        this.toggleWorkoutStarted();
        this.toggleTotalTimer();
      }
    },
  },
};
</script>

<template>
  <div class="total-timer-root">
    <div class="total-timer-main">
      <p class="total-timer">
        Workout time<strong class="time time-desktop"
          >: {{ formattedTime }}</strong
        >
      </p>
      <div class="reset-arrow">
        <arrow-circle :onClick="resetTimer" />
      </div>
      <button
        class="workout-start-btn"
        :class="{ 'workout-start-btn-active': isWorkoutStarted }"
        @click="toggleTotalTimer"
      >
        {{ btnText }}
      </button>
    </div>
    <strong class="time time-mobile">{{ formattedTime }}</strong>
  </div>
</template>

<script>
import "./TotalTimer.css";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TotalTimer",
  data() {
    return {
      intervalObject: null,
    };
  },
  computed: {
    ...mapGetters(["totalTime", "isWorkoutStarted"]),
    btnText() {
      return this.isWorkoutStarted ? "Finish Workout" : "Start Workout";
    },
  },
  methods: {
    ...mapActions(["addTotalTime", "toggleWorkoutStarted"]),
    toggleTotalTimer() {
      if (this.intervalObject && this.isWorkoutStarted) {
        clearInterval(this.intervalObject);
      } else {
        this.intervalObject = setInterval(() => {
          this.addTotalTime();
        }, 1000);
      }

      this.toggleWorkoutStarted();
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
    <p class="total-timer">
      Workout time: <strong class="time">{{ totalTime }}</strong>
    </p>
    <button class="workout-start-btn" @click="toggleTotalTimer">
      {{ btnText }}
    </button>
  </div>
</template>

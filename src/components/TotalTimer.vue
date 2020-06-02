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
    formattedTime() {
      if (this.totalTime >= 60) {
        const minutes = Math.floor(this.totalTime / 60);

        if (minutes >= 60) {
          const hours = Math.floor(minutes / 60);
          const formattedMinutes = minutes % (hours * 60);
          const seconds = this.totalTime % (60 * minutes);

          return `${hours}h:${formattedMinutes}m:${this.formatSeconds(
            seconds
          )}s`;
        } else {
          const seconds = this.totalTime % (60 * minutes);

          return `${minutes}m:${this.formatSeconds(seconds)}s`;
        }
      } else if (this.totalTime < 10) {
        return this.formatSeconds(this.totalTime);
      }

      return this.totalTime;
    },
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
    formatSeconds(num) {
      if (num < 10) {
        return `0${num}`;
      }

      return num;
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
      Workout time: <strong class="time">{{ formattedTime }}</strong>
    </p>
    <button class="workout-start-btn" @click="toggleTotalTimer">
      {{ btnText }}
    </button>
  </div>
</template>

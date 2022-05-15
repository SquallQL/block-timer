<script>
import "./WorkoutBanner.css";
import { mapGetters } from "vuex";
import { formatTime } from "../../util/timeUtils";

export default {
  name: "WorkoutBanner",
  data() {
    return {
      intervalObject: null,
      totalTime: 0,
    };
  },
  computed: {
    ...mapGetters(["isWorkoutStarted"]),
    formattedTime() {
      return formatTime(this.totalTime);
    },
  },
  watch: {
    isWorkoutStarted(flag) {
      if (flag) {
        this.startCounting();
      } else {
        clearInterval(this.intervalObject);
      }
    },
  },
  methods: {
    startCounting() {
      this.intervalObject = setInterval(() => {
        this.totalTime += 1;
      }, 1000);
    },
  },
};
</script>

<template>
  <div class="total-timer-root">
    <div class="total-timer-main">
      <p class="total-timer">
        Workout time:
        <span class="time time-desktop" data-testId="total-workout-timer">
          {{ formattedTime }}
        </span>
      </p>
    </div>
    <strong class="time time-mobile">{{ formattedTime }}</strong>
  </div>
</template>

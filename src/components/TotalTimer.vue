<script>
import "./TotalTimer.css";
import { mapGetters } from "vuex";
import { formatTime } from "../util/timeUtils";

export default {
  name: "TotalTimer",

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
  methods: {
    toggleTotalTimer() {
      this.intervalObject = setInterval(() => {
        this.totalTime += 1;
      }, 1000);
    },
  },
  watch: {
    isWorkoutStarted(flag) {
      if (flag) {
        this.toggleTotalTimer();
      } else {
        clearInterval(this.intervalObject);
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
    </div>
    <strong class="time time-mobile">{{ formattedTime }}</strong>
  </div>
</template>

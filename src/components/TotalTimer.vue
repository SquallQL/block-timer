<script>
import "./TotalTimer.css";
import Logo from "./icon/Logo.vue";
import { mapGetters } from "vuex";
import { formatTime } from "../util/timeUtils";

export default {
  name: "TotalTimer",
  components: {
    Logo,
  },
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
        this.toggleTotalTimer();
      } else {
        clearInterval(this.intervalObject);
      }
    },
  },
  methods: {
    toggleTotalTimer() {
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
        <span class="time time-desktop"> {{ formattedTime }}</span>
      </p>
    </div>
    <strong class="time time-mobile">{{ formattedTime }}</strong>
  </div>
</template>

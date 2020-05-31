<script>
import "./TotalTimer.css";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TotalTimer",
  data() {
    return {
      intervalObject: null,
      isStarted: false,
    };
  },
  computed: {
    ...mapGetters(["totalTime"]),
    btnText() {
      return this.isStarted ? "Finish Workout" : "Start Workout";
    },
  },
  methods: {
    ...mapActions(["addTotalTime"]),
    toggleTotalTimer() {
      if (this.isStarted) {
        clearInterval(this.intervalObject);
      } else {
        this.intervalObject = setInterval(() => {
          this.addTotalTime();
        }, 1000);
      }

      this.isStarted = !this.isStarted;
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

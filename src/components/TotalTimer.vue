<script>
import "./TotalTimer.css";
import { mapGetters } from "vuex";

export default {
  name: "TotalTimer",
  props: {},
  computed: {
    ...mapGetters(["totalTime"]),
  },
};
</script>

<template>
  <div class="root">
    <p class="total-timer">
      Workout total timer: <strong class="time">{{ totalTime }}</strong>
    </p>
  </div>
</template>

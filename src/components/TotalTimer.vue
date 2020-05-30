<script>
import "./TotalTimer.css";

export default {
  name: "TotalTimer",
  props: {},
  data() {
    return {
      time: "00:00",
    };
  },
};
</script>

<template>
  <div class="root">
    <p class="total-timer">
      Workout total timer: <strong class="time">{{ time }}</strong>
    </p>
  </div>
</template>

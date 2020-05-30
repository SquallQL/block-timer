<script>
import { mapGetters, mapActions } from "vuex";
import "./MainTimer.css";

export default {
  name: "MainTimer",
  props: {},
  data() {
    return {
      time: "00:00",
    };
  },
  computed: {
    ...mapGetters(["currentRunningTimer", "timers"]),
  },
  methods: {
    ...mapActions([
      "TimerSetup",
      "removeTimer",
      "setActiveTime",
      "setRestTime",
    ]),
  },
};
</script>

<template>
  <div>
    <h1 class="timer">{{ time }}</h1>
  </div>
</template>

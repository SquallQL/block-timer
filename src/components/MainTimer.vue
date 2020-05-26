<script>
import { mapGetters, mapActions } from "vuex";
import "./MainTimer.css";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  computed: {
    ...mapGetters(["currentRunningTimer", "timers"]),
  },
  methods: {
    ...mapActions(["addTimer", "removeTimer", "setActiveTime", "setRestTime"]),
  },
};
</script>

<template>
  <div class="hello">
    <h1>{{ currentRunningTimer }}</h1>
    <button @click="removeTimer(0)">
      Remove timer
    </button>
    <ul>
      <li v-for="timer in timers" :key="timer.id">
        <span>Active: {{ timer.active }} Rest: {{ timer.rest }}</span>
      </li>
    </ul>
  </div>
</template>

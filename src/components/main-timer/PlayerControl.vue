<script>
import { mapActions, mapGetters } from "vuex";
import "./PlayerControl.css";

import PlayIcon from "../icon/PlayIcon.vue";
import PauseIcon from "../icon/PauseIcon.vue";
import RepeatIcon from "../icon/RepeatIcon.vue";
import StopIcon from "../icon/StopIcon.vue";

import {
  ACTIVE_STATE,
  REST_STATE,
  READY_STATE,
} from "../../constants/constants";

export default {
  name: "PlayerControl",
  components: {
    PlayIcon,
    PauseIcon,
    RepeatIcon,
    StopIcon,
  },
  data() {
    return {
      colors: {
        [ACTIVE_STATE]: "#ff7373",
        [REST_STATE]: "#6ac5f9",
        [READY_STATE]: "#ffffff",
      },
    };
  },
  computed: {
    ...mapGetters(["currentRun", "currentTimerSettings", "selectedTimerID"]),
    isActive() {
      return this.currentRun.isActive;
    },
    isPaused() {
      return this.currentRun.isPaused;
    },
    currentRunState() {
      return this.currentRun.state;
    },
    currentColor() {
      return this.currentTimerSettings.isInterval
        ? this.colors[this.currentRunState]
        : this.colors[READY_STATE];
    },
    borderStyle() {
      return `border-color:${this.currentColor}`;
    },
  },
  methods: {
    ...mapActions(["togglePause", "toggleTimer", "stopWorkout"]),
    stopTimer() {
      this.toggleTimer(this.selectedTimerID);
      this.stopWorkout();
    },
    rewindTimer() {
      this.$emit("rewind");
    },
  },
};
</script>

<template>
  <div class="player-root" :style="borderStyle">
    <repeat-icon :on-click="rewindTimer" />
    <play-icon v-if="isPaused" :on-click="togglePause" />
    <pause-icon v-else :on-click="togglePause" />
    <stop-icon :on-click="stopTimer" />
  </div>
</template>

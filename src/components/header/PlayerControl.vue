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
        [READY_STATE]: "#000000",
      },
    };
  },
  computed: {
    ...mapGetters(["currentRun", "selectedTimerID"]),
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
      return this.colors[this.currentRunState];
    },
    borderStyle() {
      return `border-color:${this.currentColor}`;
    },
  },
  methods: {
    ...mapActions(["togglePause", "toggleTimer"]),
    stopTimer() {
      this.toggleTimer(this.selectedTimerID);
    },
    rewindTimer() {
      this.$emit("rewind");
    },
  },
};
</script>

<template>
  <div class="player-root" :style="borderStyle">
    <repeat-icon :onClick="rewindTimer" :color="currentColor" />
    <div v-if="isPaused" class="play-padding">
      <play-icon :onClick="togglePause" :color="currentColor" />
    </div>
    <pause-icon v-else :onClick="togglePause" :color="currentColor" />
    <stop-icon :onClick="stopTimer" :color="currentColor" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import "./PlayerControl.css";

import PlayIcon from "../icon/PlayIcon.vue";
import PauseIcon from "../icon/PauseIcon.vue";
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
    ...mapGetters(["currentRun"]),
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
  },
  methods: {
    ...mapActions(["togglePause"]),
  },
};
</script>

<template>
  <div class="player-root">
    <div v-if="isPaused" class="play-padding">
      <play-icon :onClick="togglePause" :color="currentColor" />
    </div>
    <pause-icon v-else :onClick="togglePause" :color="currentColor" />
  </div>
</template>

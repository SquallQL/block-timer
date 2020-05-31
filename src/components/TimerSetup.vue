<script>
import "./TimerSetup.css";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "TimerSetup",
  props: {
    timer: {
      require: true,
      type: Object,
    },
    index: {
      require: true,
      type: Number,
    },
  },
  data() {
    return {
      isHoveringStartBtn: false,
      isInterval: true,
      isInfinite: false,
    };
  },
  computed: {
    ...mapGetters(["currentRun", "selectedTimerID"]),
    intervalID() {
      return `interval-${this.index}`;
    },
    repeatID() {
      return `repeat-${this.index}`;
    },
    isActiveTimer() {
      return this.currentRun.isActive && this.selectedTimerID === this.index;
    },
    startText() {
      return this.isActiveTimer ? "Stop" : "Start";
    },
    canEdit() {
      return !this.isActiveTimer;
    },
  },
  methods: {
    ...mapActions([
      "toggleTimer",
      "toggleIntervalTimer",
      "toggleInfiniteTimer",
    ]),
    setIsHovering(flag) {
      this.isHoveringStartBtn = flag;
    },
  },
};
</script>

<template>
  <div class="TimerSetup-root">
    <div>
      <button
        class="start-btn"
        :class="{ 'btn-isActive': isActiveTimer }"
        @click="toggleTimer(index)"
        @mouseenter="setIsHovering(true)"
        @mouseleave="setIsHovering(false)"
      >
        {{ startText }}
      </button>
    </div>
    <div class="wrapper">
      <div
        class="time-row"
        :class="{
          'time-isActive': !isHoveringStartBtn && isActiveTimer,
          'time-start-hover': isHoveringStartBtn,
        }"
      >
        <div class="section">
          <div class="subtitle" :class="{ 'subtitle-hidden': !isInterval }">
            Active
          </div>
          <div>
            <span class="number" :class="{ 'active-time': isInterval }">
              {{ timer.active }}
            </span>
          </div>
        </div>
        <div v-if="isInterval" class="section">
          <div class="subtitle">
            Rest
          </div>
          <div class="">
            <span class="time-symbol">/</span>
            <span class="number rest-time">{{ timer.rest }}</span>
          </div>
        </div>
        <div class="section">
          <div class="subtitle">Cycle</div>
          <div class="number">
            <span class="time-symbol">x</span>
            <span v-if="!isInfinite">{{ timer.cycle }}</span>
            <span v-else>&#8734;</span>
          </div>
        </div>
        <div class="check-section">
          <div class="check-option">
            <input
              :id="intervalID"
              type="checkbox"
              value="interval"
              v-model="isInterval"
              @click="toggleIntervalTimer(index)"
              :disabled="!canEdit"
            />
            <label :for="intervalID">Interval timer</label>
          </div>
          <div class="check-option">
            <input
              :id="repeatID"
              type="checkbox"
              value="repeat"
              v-model="isInfinite"
              @click="toggleInfiniteTimer(index)"
              :disabled="!canEdit"
            />
            <label :for="repeatID">Repeat forever</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

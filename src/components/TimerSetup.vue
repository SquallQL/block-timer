<script>
import "./TimerSetup.css";
import { mapActions } from "vuex";

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
      isHoveringStart: false,
      isInterval: true,
      isInfinite: false,
    };
  },
  computed: {
    intervalID() {
      return `interval-${this.index}`;
    },
    repeatID() {
      return `repeat-${this.index}`;
    },
    isActiveTimer() {
      return this.selectedTimerID === this.index;
    },
    startText() {
      return this.isActiveTimer ? "Current" : "Start";
    },
  },
  methods: {
    ...mapActions(["toggleIntervalTimer", "toggleInfiniteTimer"]),
    setIsHovering(flag) {
      this.isHoveringStart = flag;
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
          'time-start-hover': isHoveringStart,
          'time-isActive': isActiveTimer,
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
            />
            <label :for="repeatID">Repeat forever</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./TimerSetup.css";
import { mapActions, mapGetters } from "vuex";
import { formatTime } from "../util/timeUtils";

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
      activeTime: this.timer.active,
      restTime: this.timer.rest,
      currentCycle: this.timer.cycle,
      isHoveringStartBtn: false,
      isInterval: this.timer.isInterval,
      isInfinite: this.timer.isInfinite,
    };
  },
  computed: {
    ...mapGetters(["currentRun", "selectedTimerID", "isWorkoutStarted"]),
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
    isDone() {
      return this.isActiveTimer && this.currentRun.cycle >= this.timer.cycle;
    },
    total() {
      return this.isInterval
        ? formatTime((this.timer.active + this.timer.rest) * this.timer.cycle)
        : formatTime(this.timer.active * this.timer.cycle);
    },
  },
  methods: {
    ...mapActions([
      "setActiveTime",
      "setRestTime",
      "setCycle",
      "toggleTimer",
      "toggleIntervalTimer",
      "toggleInfiniteTimer",
      "resetCycle",
      "toggleWorkoutStarted",
    ]),
    setIsHovering(flag) {
      this.isHoveringStartBtn = flag;
    },
    toggleStartBtn() {
      if (!this.isWorkoutStarted) {
        this.toggleWorkoutStarted();
      }

      this.toggleTimer(this.index);
    },
    activeChange() {
      const castedActiveTime = Number(this.activeTime);

      if (castedActiveTime) {
        this.setActiveTime({ id: this.index, activeTime: castedActiveTime });
      }
    },
    restChange() {
      const castedRestTime = Number(this.restTime);

      if (castedRestTime) {
        this.setRestTime({ id: this.index, restTime: castedRestTime });
      }
    },
    cycleChange() {
      const castedCycle = Number(this.currentCycle);

      if (castedCycle) {
        this.setCycle({ id: this.index, cycle: castedCycle });
      }
    },
  },
  watch: {
    isDone(flag) {
      if (flag) {
        this.$refs["start-btn"].click();
        this.resetCycle();
      }
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
        @click="toggleStartBtn"
        @mouseenter="setIsHovering(true)"
        @mouseleave="setIsHovering(false)"
        ref="start-btn"
      >
        {{ startText }}
      </button>
    </div>
    <div class="wrapper">
      <div class="wrapper-inside">
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
              <input
                class="default-input number"
                :class="{ 'active-time': isInterval }"
                type="text"
                v-model="activeTime"
                @input="activeChange"
                maxlength="2"
                :disabled="!canEdit"
              />
            </div>
          </div>
          <div v-if="isInterval" class="section">
            <div class="subtitle">
              Rest
            </div>
            <div class="">
              <span class="time-symbol">/</span>
              <input
                class="default-input number"
                :class="{ 'rest-time': isInterval }"
                v-model="restTime"
                @input="restChange"
                type="text"
                maxlength="2"
                :disabled="!canEdit"
              />
            </div>
          </div>
          <div class="section">
            <div class="subtitle">Cycle</div>
            <div class="number">
              <span class="time-symbol">x</span>
              <input
                v-if="!isInfinite"
                v-model="currentCycle"
                class="default-input number"
                type="text"
                @input="cycleChange"
                maxlength="2"
                :disabled="!canEdit"
              />
              <span v-else>&#8734;</span>
            </div>
          </div>
          <div class="check-spacer"></div>
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
        <div v-if="!isInfinite" class="timer-total-time">
          Length: <strong>{{ total }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

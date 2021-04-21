<script>
import "./TimerSetup.css";
import { mapActions, mapGetters } from "vuex";
import { formatTime } from "../util/timeUtils";

export default {
  name: "TimerSetup",
  inputRefNames: {
    active: "activeInput",
    rest: "restInput",
    cycle: "cycleInput",
  },
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
      activeTime: Number(this.timer.active),
      restTime: Number(this.timer.rest),
      timerCycle: Number(this.timer.cycle),
      isInfinite: this.timer.isInfinite,
      isInterval: this.timer.isInterval,
      isHoveringStartBtn: false,
    };
  },
  computed: {
    ...mapGetters(["currentRun", "selectedTimerID", "isWorkoutStarted"]),

    canEdit() {
      return !this.isActiveTimer;
    },
    isActiveTimer() {
      return this.currentRun.isActive && this.selectedTimerID === this.index;
    },
    intervalID() {
      return `interval-${this.index}`;
    },
    isStartBtnDisabled() {
      return this.currentRun.isActive && this.selectedTimerID !== this.index;
    },
    startText() {
      return this.isActiveTimer ? "Stop" : "Start";
    },
    repeatID() {
      return `repeat-${this.index}`;
    },
    total() {
      const castedActive = Number(this.activeTime);
      const castedRest = Number(this.restTime);
      const castedCycle = Number(this.timerCycle);

      return this.isInterval
        ? formatTime((castedActive + castedRest) * castedCycle)
        : formatTime(castedActive * castedCycle);
    },
  },
  methods: {
    ...mapActions([
      "removeTimer",
      "setActiveTime",
      "setRestTime",
      "setCycle",
      "toggleTimer",
      "toggleIntervalTimer",
      "toggleInfiniteTimer",
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
      window?.scrollTo(0, 0);
    },
    activeChange() {
      const castedActiveTime = Number(this.activeTime);

      // Invalid input prevent
      if (isNaN(castedActiveTime)) {
        this.activeTime = "";
      }

      if (castedActiveTime) {
        this.setActiveTime({ id: this.index, activeTime: castedActiveTime });
      }
    },
    restChange() {
      const castedRestTime = Number(this.restTime);

      // Invalid input prevent
      if (isNaN(castedRestTime)) {
        this.restTime = "";
      }

      if (castedRestTime) {
        this.setRestTime({ id: this.index, restTime: castedRestTime });
      }
    },
    cycleChange() {
      const castedCycle = Number(this.timerCycle);

      if (isNaN(castedCycle)) {
        this.timerCycle = "";
      }

      if (castedCycle) {
        this.setCycle({ id: this.index, cycle: castedCycle });
      }
    },
  },
};
</script>

<template>
  <transition appear name="fade">
    <div class="TimerSetup-root">
      <button
        class="start-btn"
        :class="{ 'btn-isActive': isActiveTimer }"
        @click="toggleStartBtn"
        @mouseenter="setIsHovering(true)"
        @mouseleave="setIsHovering(false)"
        :disabled="isStartBtnDisabled"
        ref="start-btn"
      >
        <span class="setup-id"> #{{ index + 1 }} </span>
        {{ startText }}
      </button>
      <div class="wrapper">
        <div
          class="wrapper-inside"
          :class="{
            'time-isActive': !isHoveringStartBtn && isActiveTimer,
            'time-start-hover': isHoveringStartBtn,
          }"
        >
          <button
            class="close-btn"
            @click="removeTimer(index)"
            :disabled="isActiveTimer"
          >
            x
          </button>
          <div class="time-row">
            <div class="section">
              <div class="subtitle">
                {{ isInterval ? "Active" : "Time" }}
              </div>
              <div>
                <input
                  ref="activeInput"
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
                  ref="restInput"
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
                  v-model="timerCycle"
                  ref="cycleInput"
                  class="default-input number"
                  type="text"
                  @input="cycleChange"
                  maxlength="2"
                  :disabled="!canEdit"
                />
                <span v-else>&#8734;</span>
              </div>
            </div>
            <div class="check-spacer" v-if="!isInfinite"></div>

            <div class="section total-section-desktop" v-if="!isInfinite">
              <div class="subtitle">Total</div>
              <div class="small-number">
                {{ total }}
              </div>
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
          <div class="total-section-mobile" v-if="!isInfinite">
            <div class="small-number">
              Total: <strong>{{ total }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

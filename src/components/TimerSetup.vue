<script>
import "./TimerSetup.css";
import { mapActions, mapGetters } from "vuex";
import { debounce } from "lodash";
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
      timerName: this.timer.name,
      isInfinite: this.timer.isInfinite,
      isInterval: this.timer.isInterval,
      isHoveringStartBtn: false,
      isTransitioningState: false,
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
    shouldHaveActiveBackground() {
      const justTransitionedToRest =
        this.isTransitioningState && !this.isActiveTimer;

      if (justTransitionedToRest) {
        return false;
      }

      return (
        !this.shouldHaveRestBackground &&
        (this.isActiveTimer || this.isHoveringStartBtn)
      );
    },
    shouldHaveRestBackground() {
      const justTransitionedToActive =
        this.isTransitioningState && this.isActiveTimer;

      if (justTransitionedToActive) {
        return false;
      }

      return this.isActiveTimer && this.isHoveringStartBtn;
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
  watch: {
    activeTime() {
      this.setActiveTime({ id: this.index, activeTime: this.activeTime });
    },
    restTime() {
      this.setRestTime({ id: this.index, restTime: this.restTime });
    },
    timerCycle() {
      this.setCycle({ id: this.index, cycle: this.timerCycle });
    },
  },
  methods: {
    ...mapActions([
      "removeTimer",
      "setActiveTime",
      "setRestTime",
      "setTimerName",
      "setCycle",
      "toggleTimer",
      "toggleIntervalTimer",
      "toggleInfiniteTimer",
      "toggleWorkoutStarted",
    ]),
    handleStartBtnOut() {
      this.setIsHovering(false);
      this.isTransitioningState = false;
    },
    isNumber(e) {
      let keyCode = e.keyCode ? e.keyCode : e.which;

      if (keyCode < 48 || keyCode > 57) {
        e.preventDefault();
      }
    },
    setIsHovering(flag) {
      this.isHoveringStartBtn = flag;
    },
    setNewTimerName: debounce(function(e) {
      const { value: newName } = e.target;

      this.timerName = newName;
      this.setTimerName({ id: this.index, name: newName });
    }, 500),

    toggleStartBtn() {
      this.toggleWorkoutStarted();

      this.toggleTimer(this.index);
      window?.scrollTo(0, 0);

      // To make the hover not suddently become the "other"
      // color, we want to disable the hover color change
      // until the user has moused out of the start BTN
      this.isTransitioningState = true;
    },
  },
};
</script>

<template>
  <transition appear name="fade">
    <div class="TimerSetup-root">
      <div class="wrapper">
        <div
          class="timer-header-section"
          :class="{
            'btn-isActive': shouldHaveActiveBackground,
            'btn-isRest': shouldHaveRestBackground,
          }"
        >
          <input
            class="timer-name"
            :class="{
              'timer-name-active': shouldHaveActiveBackground,
              'timer-name-rest': shouldHaveRestBackground,
            }"
            @input="setNewTimerName"
            :value="timerName"
            placeholder="Add timer name"
          />
        </div>
        <div
          class="wrapper-inside time-start"
          :class="{
            'time-isActive': shouldHaveActiveBackground,
            'time-start-hover': isHoveringStartBtn && !isTransitioningState,
            'time-isRest': shouldHaveRestBackground,
          }"
        >
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
                  @keypress="isNumber"
                  maxlength="2"
                  :disabled="!canEdit"
                />
              </div>
            </div>
            <div v-if="isInterval" class="section">
              <div class="subtitle">
                Rest
              </div>
              <div>
                <span class="time-symbol">/</span>
                <input
                  ref="restInput"
                  class="default-input number"
                  :class="{ 'rest-time': isInterval }"
                  v-model="restTime"
                  @keypress="isNumber"
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
                  @keypress="isNumber"
                  maxlength="2"
                  :disabled="!canEdit"
                />
                <span v-else>&#8734;</span>
              </div>
            </div>
            <div class="check-spacer"></div>
            <div class="section">
              <button
                class="start-btn"
                :class="{
                  'btn-isActive': isActiveTimer,
                  'btn-isRest': shouldHaveRestBackground,
                }"
                @click="toggleStartBtn"
                @mouseenter="setIsHovering(true)"
                @mouseleave="handleStartBtnOut"
                :disabled="isStartBtnDisabled"
                ref="start-btn"
              >
                {{ startText }}
              </button>
            </div>
          </div>
          <div class="footer-section">
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
            <div class="total-section-desktop">
              <div class="total">
                Total:
                <strong v-if="!isInfinite">{{ total }}</strong>
                <span v-else class="infinite-symbol">&#8734;</span>
              </div>
            </div>
          </div>

          <div class="total-section-mobile" v-if="!isInfinite">
            <div class="small-number">
              Total:<strong>{{ total }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

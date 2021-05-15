<script>
import "./css/TimerSetup.css";
import { mapActions, mapGetters } from "vuex";
import TimerSetupHeader from "./TimerSetupHeader";
import { formatTime } from "../../util/timeUtils";

export default {
  name: "TimerSetup",
  inputRefNames: {
    active: "activeInput",
    rest: "restInput",
    cycle: "cycleInput",
  },
  components: {
    TimerSetupHeader,
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
      isTransitioningState: false,
    };
  },
  computed: {
    ...mapGetters(["currentRun", "selectedTimerID", "isWorkoutStarted"]),

    isEditable() {
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
    hasActiveBackground() {
      const justTransitionedToRest =
        this.isTransitioningState && !this.isActiveTimer;

      if (justTransitionedToRest) {
        return false;
      }

      return (
        !this.hasRestBackground &&
        (this.isActiveTimer || this.isHoveringStartBtn)
      );
    },
    hasRestBackground() {
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
      "resetCycle",
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

    toggleStartBtn() {
      this.toggleWorkoutStarted();
      this.resetCycle();

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
        <TimerSetupHeader
          :has-active-background="hasActiveBackground"
          :has-rest-background="hasRestBackground"
          :index="index"
          :is-editable="isEditable"
          :timer="timer"
        />
        <div
          class="wrapper-inside time-start"
          :class="{
            'time-isActive': hasActiveBackground,
            'time-start-hover': isHoveringStartBtn && !isTransitioningState,
            'time-isRest': hasRestBackground,
          }"
        >
          <div class="time-row">
            <div class="time-row-left">
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
                    :disabled="!isEditable"
                  />
                </div>
              </div>
              <template v-if="isInterval">
                <span class="section time-symbol">/</span>
                <div class="section">
                  <div class="subtitle">
                    Rest
                  </div>
                  <div>
                    <input
                      ref="restInput"
                      class="default-input number"
                      :class="{ 'rest-time': isInterval }"
                      v-model="restTime"
                      @keypress="isNumber"
                      type="text"
                      maxlength="2"
                      :disabled="!isEditable"
                    />
                  </div>
                </div>
              </template>
              <span class="section time-symbol">x</span>
              <div class="section">
                <div class="subtitle">Cycle</div>
                <div class="number">
                  <input
                    v-if="!isInfinite"
                    v-model="timerCycle"
                    ref="cycleInput"
                    class="default-input number"
                    type="text"
                    @keypress="isNumber"
                    maxlength="2"
                    :disabled="!isEditable"
                  />
                  <span class="infinite" v-else>&#8734;</span>
                </div>
              </div>
              <div class="check-spacer"></div>
            </div>
            <div class="section start-btn-section-desktop">
              <button
                class="start-btn"
                :class="{
                  'btn-isActive': isActiveTimer,
                  'btn-isRest': hasRestBackground,
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
                  :disabled="!isEditable"
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
                  :disabled="!isEditable"
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
          <div class="section start-btn-section-mobile">
            <button
              class="start-btn"
              :class="{
                'btn-isActive': isActiveTimer,
                'btn-isRest': hasRestBackground,
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
      </div>
    </div>
  </transition>
</template>

<script>
import "./css/TimerSetup.css";
import { mapActions, mapGetters } from "vuex";
import TimerSetupHeader from "./TimerSetupHeader";
import TimerSetupInterval from "./TimerSetupInterval";
import TimerSetupActions from "./TimerSetupActions.vue";
import { formatTime } from "../../util/timeUtils";

export default {
  name: "TimerSetup",
  inputRefNames: {
    active: "activeInput",
    rest: "restInput",
    cycle: "cycleInput",
  },
  components: {
    TimerSetupActions,
    TimerSetupHeader,
    TimerSetupInterval,
  },
  props: {
    timer: {
      required: true,
      type: Object,
    },
    index: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      isHoveringStartBtn: false,
      isInfinite: this.timer.isInfinite,
      isInterval: this.timer.isInterval,
      isTransitioningState: false,
    };
  },
  computed: {
    ...mapGetters(["currentRun", "selectedTimerID", "isWorkoutStarted"]),
    formattedTotal() {
      return formatTime(this.timer.total);
    },
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
    repeatID() {
      return `repeat-${this.index}`;
    },
  },
  methods: {
    ...mapActions([
      "resetCycle",
      "toggleTimer",
      "toggleIntervalTimer",
      "toggleInfiniteTimer",
      "toggleWorkoutStarted",
    ]),
    onStartButtonEnter() {
      this.isHoveringStartBtn = true;
    },
    onStartButtonOut() {
      this.isHoveringStartBtn = false;
      this.isTransitioningState = false;
    },
    onStartButtonClick() {
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
          <TimerSetupInterval
            :has-active-background="hasActiveBackground"
            :has-rest-background="hasRestBackground"
            :index="index"
            :is-active-timer="isActiveTimer"
            :is-start-btn-disabled="isStartBtnDisabled"
            :timer="timer"
            @start-btn-enter="onStartButtonEnter"
            @start-btn-out="onStartButtonOut"
            @start-btn-click="onStartButtonClick"
          />
          <div class="footer-section">
            <div class="check-section">
              <div class="check-option">
                <input
                  :id="intervalID"
                  v-model="isInterval"
                  type="checkbox"
                  value="interval"
                  :disabled="!isEditable"
                  @click="toggleIntervalTimer(index)"
                />
                <label :for="intervalID">Interval timer</label>
              </div>
              <div class="check-option">
                <input
                  :id="repeatID"
                  v-model="isInfinite"
                  type="checkbox"
                  value="repeat"
                  :disabled="!isEditable"
                  @click="toggleInfiniteTimer(index)"
                />
                <label :for="repeatID">Repeat forever</label>
              </div>
            </div>
            <div class="total-section-desktop">
              <div class="total">
                Total:
                <strong v-if="!isInfinite">{{ formattedTotal }}</strong>
                <span v-else class="infinite-symbol">&#8734;</span>
              </div>
            </div>
          </div>

          <div v-if="!isInfinite" class="total-section-mobile">
            <div class="small-number">
              Total:<strong>{{ formattedTotal }}</strong>
            </div>
          </div>
          <div class="section start-btn-section-mobile">
            <TimerSetupActions
              :has-active-background="hasActiveBackground"
              :has-rest-background="hasRestBackground"
              :is-active-timer="isActiveTimer"
              :is-disabled="isStartBtnDisabled"
              @start-btn-enter="onStartButtonEnter"
              @start-btn-out="onStartButtonOut"
              @start-btn-click="onStartButtonClick"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

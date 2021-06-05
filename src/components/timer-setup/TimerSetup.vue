<script>
import "./css/TimerSetup.css";
import { mapActions, mapGetters } from "vuex";
import TimerSetupHeader from "./TimerSetupHeader";
import TimerSetupInterval from "./TimerSetupInterval";
import TimerSetupActions from "./TimerSetupActions.vue";
import TimerSetupOptions from "./TimerSetupOptions.vue";

export default {
  name: "TimerSetup",
  components: {
    TimerSetupActions,
    TimerSetupHeader,
    TimerSetupInterval,
    TimerSetupOptions,
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
      isTransitioningState: false,
    };
  },
  computed: {
    ...mapGetters(["currentRun", "selectedTimerID"]),
    isEditable() {
      return !this.isActiveTimer;
    },
    isActiveTimer() {
      return this.currentRun.isActive && this.selectedTimerID === this.index;
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
  },
  methods: {
    ...mapActions(["resetCycle", "toggleTimer", "toggleWorkoutStarted"]),
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
          <TimerSetupOptions
            :index="index"
            :is-disabled="!isEditable"
            :timer="timer"
          />
          <div class="start-btn-section-mobile">
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

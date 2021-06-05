<script>
import { mapActions } from "vuex";
import TimerSetupActions from "./TimerSetupActions.vue";
import "./css/TimerSetupInterval.css";

export default {
  components: { TimerSetupActions },
  props: {
    hasActiveBackground: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasRestBackground: {
      type: Boolean,
      required: false,
      default: false,
    },
    index: {
      type: Number,
      required: true,
    },
    isActiveTimer: {
      type: Boolean,
      required: true,
    },
    isStartBtnDisabled: {
      type: Boolean,
      required: true,
    },
    timer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeTime: Number(this.timer.active),
      restTime: Number(this.timer.rest),
      timerCycle: Number(this.timer.cycle),
    };
  },
  computed: {
    isEditable() {
      return !this.isActiveTimer;
    },
    isInfinite() {
      return this.timer.isInfinite;
    },
    isInterval() {
      return this.timer.isInterval;
    },
    total() {
      const castedActive = Number(this.activeTime);
      const castedRest = Number(this.restTime);
      const castedCycle = Number(this.timerCycle);

      return this.isInterval
        ? (castedActive + castedRest) * castedCycle
        : castedActive * castedCycle;
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
    total(newVal) {
      this.setTimerTotalTime({ id: this.index, total: newVal });
    },
  },
  methods: {
    ...mapActions([
      "setActiveTime",
      "setRestTime",
      "setCycle",
      "setTimerTotalTime",
    ]),
    isNumber(e) {
      let keyCode = e.keyCode ? e.keyCode : e.which;

      if (keyCode < 48 || keyCode > 57) {
        e.preventDefault();
      }
    },
  },
};
</script>

<template>
  <div class="time-row">
    <div class="time-row-left">
      <div class="section">
        <div class="subtitle">
          {{ isInterval ? "Active" : "Time" }}
        </div>
        <div>
          <input
            ref="activeInput"
            v-model="activeTime"
            class="default-input number"
            :class="{ 'active-time': isInterval }"
            :disabled="!isEditable"
            type="text"
            maxlength="2"
            data-testid="activeInput"
            @keypress="isNumber"
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
              v-model="restTime"
              class="default-input number"
              :class="{ 'rest-time': isInterval }"
              type="text"
              maxlength="2"
              :disabled="!isEditable"
              data-testid="restInput"
              @keypress="isNumber"
            />
          </div>
        </div>
      </template>
      <span class="section time-symbol">x</span>
      <div class="section">
        <div class="subtitle">
          Cycle
        </div>
        <div class="number">
          <input
            v-if="!isInfinite"
            ref="cycleInput"
            v-model="timerCycle"
            class="default-input number"
            type="text"
            maxlength="2"
            :disabled="!isEditable"
            data-testid="cycleInput"
            @keypress="isNumber"
          />
          <span v-else class="infinite">&#8734;</span>
        </div>
      </div>
      <div class="check-spacer" />
    </div>
    <div class="start-btn-section-desktop">
      <TimerSetupActions
        :has-active-background="hasActiveBackground"
        :has-rest-background="hasRestBackground"
        :is-active-timer="isActiveTimer"
        :is-disabled="isStartBtnDisabled"
        v-on="$listeners"
      />
    </div>
  </div>
</template>

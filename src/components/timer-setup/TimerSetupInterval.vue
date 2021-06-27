<script>
import { mapActions } from "vuex";
import "./css/TimerSetupInterval.css";
import TimerSetupTotal from "../timer-setup/TimerSetupTotal.vue";

export default {
  components: {
    TimerSetupTotal,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    isActiveTimer: {
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
    setActiveDefault(e) {
      const { value } = e.target;
      console.log(value);

      if (value === "" || value === "0") {
        this.activeTime = "15";
      }
    },
    setRestDefault(e) {
      const { value } = e.target;

      if (value === "" || value === "0") {
        this.restTime = "5";
      }
    },
    setCycleDefault(e) {
      const { value } = e.target;

      if (value === "" || value === "0") {
        this.timerCycle = "1";
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
            @blur="setActiveDefault"
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
              @blur="setRestDefault"
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
            @blur="setCycleDefault"
          />
          <span v-else class="infinite">&#8734;</span>
        </div>
      </div>
      <span class="section time-symbol duration-mobile-section">
        =
      </span>
      <div class="section duration-mobile-section">
        <div class="subtitle">
          Duration
        </div>
        <div class="total-time-section">
          <timer-setup-total :timer="timer" :is-infinite="isInfinite" />
        </div>
      </div>
    </div>
  </div>
</template>

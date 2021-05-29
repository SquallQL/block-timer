<script>
import { mapActions } from "vuex";
import TimerSetupTotal from "./TimerSetupTotal.vue";
import "./css/TimerSetupOptions.css";

export default {
  components: {
    TimerSetupTotal,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    timer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isInfinite: this.timer.isInfinite,
      isInterval: this.timer.isInterval,
    };
  },
  computed: {
    intervalID() {
      return `interval-${this.index}`;
    },
    repeatID() {
      return `repeat-${this.index}`;
    },
  },
  methods: {
    ...mapActions(["toggleIntervalTimer", "toggleInfiniteTimer"]),
  },
};
</script>

<template>
  <div>
    <div class="footer-section">
      <div class="check-section">
        <div class="check-option">
          <input
            :id="intervalID"
            v-model="isInterval"
            type="checkbox"
            value="interval"
            :disabled="isDisabled"
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
            :disabled="isDisabled"
            @click="toggleInfiniteTimer(index)"
          />
          <label :for="repeatID">Repeat forever</label>
        </div>
      </div>
      <div class="total-section-desktop">
        <TimerSetupTotal :is-infinite="isInfinite" :timer="timer" />
      </div>
    </div>
    <div class="total-section-mobile">
      <TimerSetupTotal :is-infinite="isInfinite" :timer="timer" />
    </div>
  </div>
</template>

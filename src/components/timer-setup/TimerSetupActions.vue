<script>
import "./css/TimerSetupActions.css";

export default {
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
    isActiveTimer: {
      type: Boolean,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    startText() {
      return this.isActiveTimer ? "Stop" : "Start";
    },
  },
  methods: {
    onMouseEnter() {
      this.$emit("start-btn-enter");
    },
    onMouseLeave() {
      this.$emit("start-btn-out");
    },
    toggleStartBtn() {
      this.$emit("start-btn-click");
    },
  },
};
</script>
<template>
  <button
    class="start-btn"
    :class="{
      'btn-isActive': hasActiveBackground,
      'btn-isRest': hasRestBackground,
    }"
    :disabled="isDisabled"
    @click="toggleStartBtn"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    {{ startText }}
  </button>
</template>

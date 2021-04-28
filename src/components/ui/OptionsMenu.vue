<script>
import { mapActions } from "vuex";
import vClickOutside from "v-click-outside";
import "./OptionsMenu.css";

export default {
  directives: {
    clickOutside: vClickOutside.directive,
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
  },
  data() {
    return {
      listener: null,
      isOpened: false,
    };
  },
  methods: {
    ...mapActions(["removeTimer", "toggleTimer", "toggleWorkoutStarted"]),
    deleteTimer(index) {
      this.removeTimer(index);

      this.closeDropdown();
    },
    startTimer(index) {
      this.toggleWorkoutStarted();

      this.toggleTimer(index);
      window?.scrollTo(0, 0);

      this.closeDropdown();
    },
    closeDropdown() {
      this.isOpened = false;
    },
    toggleDropdown() {
      this.isOpened = !this.isOpened;
    },
  },
};
</script>

<template>
  <div class="options-root">
    <button class="options-btn" @click="toggleDropdown" :disabled="isDisabled">
      ...
    </button>
    <transition name="fade">
      <ul
        v-if="isOpened"
        class="options-dropdown"
        v-click-outside="toggleDropdown"
      >
        <li><a @click="deleteTimer(index)">Delete timer</a></li>
        <li><a @click="startTimer(index)">Start timer</a></li>
      </ul>
    </transition>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import debounce from "lodash.debounce";
import "./css/TimerSetupHeader.css";
import TimerSetupActions from "../timer-setup/TimerSetupActions.vue";

export default {
  i18n: {
    placeholder: "Add timer name",
  },
  components: {
    TimerSetupActions,
  },
  props: {
    hasActiveBackground: {
      type: Boolean,
      required: true,
    },
    hasRestBackground: {
      type: Boolean,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    isActiveTimer: {
      type: Boolean,
      required: true,
    },
    isEditable: {
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
      timerName: this.timer?.name || "",
    };
  },
  computed: {
    backgroundClasses() {
      if (this.hasActiveBackground) {
        return "timer-setup-active";
      } else if (this.hasRestBackground) {
        return "timer-setup-rest";
      }

      return "";
    },
  },
  methods: {
    ...mapActions(["removeTimer", "setTimerName"]),
    setNewTimerName: debounce(function(e) {
      const { value: newName } = e.target;

      this.timerName = newName;
      this.setTimerName({ id: this.index, name: newName });
    }, 500),
  },
};
</script>
<template>
  <div class="timer-header-section" :class="backgroundClasses">
    <button
      class="close-btn"
      :class="{ 'dark-close-btn': hasActiveBackground }"
      :disabled="!isEditable"
      @click="removeTimer(index)"
    >
      x
    </button>
    <input
      class="timer-name"
      :class="backgroundClasses"
      :value="timerName"
      :placeholder="$options.i18n.placeholder"
      maxlength="24"
      @input="setNewTimerName"
    />
    <div class="startBtnContainer start-btn-section-desktop">
      <timer-setup-actions
        :has-active-background="hasActiveBackground"
        :has-rest-background="hasRestBackground"
        :is-active-timer="isActiveTimer"
        :is-disabled="isStartBtnDisabled"
        v-on="$listeners"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import debounce from "lodash.debounce";
import "./css/TimerSetupHeader.css";

export default {
  i18n: {
    placeholder: "Add timer name",
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
    isEditable: {
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
    <input
      class="timer-name"
      :class="backgroundClasses"
      :value="timerName"
      :placeholder="$options.i18n.placeholder"
      maxlength="24"
      @input="setNewTimerName"
    />
    <button
      class="closeBtn"
      :disabled="!isEditable"
      @click="removeTimer(index)"
    >
      x
    </button>
  </div>
</template>

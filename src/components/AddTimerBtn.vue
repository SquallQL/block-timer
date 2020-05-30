<script>
import { mapActions } from "vuex";
import "./AddTimerBtn.css";

export default {
  name: "AddTimerBtn",
  methods: {
    ...mapActions(["addTimer"]),
    addTimerClick() {
      this.addTimer();

      this.$refs["my-btn"].scrollIntoView(true);
    },
  },
};
</script>

<template>
  <button ref="my-btn" class="addTimer" @click="addTimerClick">
    Add new timer
  </button>
</template>

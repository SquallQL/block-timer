<script>
import { formatTime } from "../../util/timeUtils";
import "./css/TimerSetupTotal.css";

export default {
  props: {
    isInfinite: {
      type: Boolean,
      required: true,
    },
    timer: {
      type: Object,
      required: true,
    },
    withTotalText: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    formattedTotal() {
      return formatTime(this.timer.total);
    },
    totalClass() {
      return this.withTotalText ? "" : "big-total";
    },
    InfiniteClass() {
      return this.withTotalText ? "" : "big-infinite";
    },
  },
};
</script>
<template>
  <div class="total" :class="totalClass">
    <span v-if="withTotalText">Total:&nbsp;</span>
    <strong v-if="!isInfinite">{{ formattedTotal }}</strong>
    <span
      v-else
      class="infinite-symbol"
      :class="InfiniteClass"
      data-testid="infinite-symbol"
    >
      ∞
    </span>
  </div>
</template>

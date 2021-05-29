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
  },
  computed: {
    formattedTotal() {
      return formatTime(this.timer.total);
    },
  },
};
</script>
<template>
  <div class="total">
    Total:
    <strong v-if="!isInfinite">{{ formattedTotal }}</strong>
    <span v-else class="infinite-symbol" data-testid="infinite-symbol">
      ∞
    </span>
  </div>
</template>

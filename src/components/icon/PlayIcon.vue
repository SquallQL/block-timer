<script>
export default {
  props: {
    color: {
      require: true,
      type: String,
    },
    onClick: {
      require: true,
      type: Function,
    },
  },
  computed: {
    svgStyle() {
      return `fill:${this.color}`;
    },
  },
};
</script>
<template>
  <svg
    version="1.1"
    id="play"
    @click="onClick"
    :style="svgStyle"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 210 210"
    xml:space="preserve"
  >
    <path d="M179.07,105L30.93,210V0L179.07,105z" />
  </svg>
</template>

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
      return `fill:${this.color};`;
    },
  },
};
</script>
<template>
  <svg
    version="1.1"
    id="pause"
    @click="onClick"
    :style="svgStyle"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="40px"
    x="0"
    y="0"
    viewBox="0 0 45 45"
    xml:space="preserve"
  >
    <g>
      <rect x="15" y="10" width="4" height="30" />
      <rect x="25" y="10" width="4" height="30" />
    </g>
  </svg>
</template>

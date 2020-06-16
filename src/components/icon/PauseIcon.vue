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
    x="0px"
    y="0px"
    viewBox="0 0 365 365"
    xml:space="preserve"
  >
    <g>
      <rect x="74.5" width="70" height="360" />
      <rect x="217.5" width="70" height="360" />
    </g>
  </svg>
</template>

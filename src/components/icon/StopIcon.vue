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
    xmlns="http://www.w3.org/2000/svg"
    width="50 "
    height="50"
    version="1.1"
    @click="onClick"
    :style="svgStyle"
  >
    <g>
      <rect x="15" y="13" width="22" height="23" />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      required: true,
      type: String,
    },
    onClick: {
      required: true,
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
    id="stop"
    xmlns="http://www.w3.org/2000/svg"
    width="50 "
    height="50"
    version="1.1"
    :style="svgStyle"
    @click="onClick"
  >
    <g>
      <rect x="15" y="13" width="22" height="23" />
    </g>
  </svg>
</template>
<style scoped>
#stop {
  transition: 0.3s;

  cursor: pointer;
}

#stop:hover {
  transform: scale(1.3);
}
</style>

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
    id="repeat"
    xmlns="http://www.w3.org/2000/svg"
    width="50 "
    height="50"
    version="1.1"
    @click="onClick"
    :style="svgStyle"
  >
    <g>
      <rect x="10" y="10" width="4" height="30" />
      <polygon points="35,10 15,25 35,40" />
    </g>
  </svg>
</template>
<style scoped>
#repeat {
  transition: 0.3s;

  cursor: pointer;
}

#repeat:hover {
  transform: scale(1.3);
}
</style>

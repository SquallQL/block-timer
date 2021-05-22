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
    id="pause"
    version="1.1"
    :style="svgStyle"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="50px"
    height="50px"
    x="0"
    y="0"
    viewBox="0 0 45 45"
    xml:space="preserve"
    @click="onClick"
  >
    <g>
      <rect x="15" y="10" width="4" height="25" />
      <rect x="25" y="10" width="4" height="25" />
    </g>
  </svg>
</template>
<style scoped>
#pause {
  transition: 0.3s;

  cursor: pointer;
}

#pause:hover {
  transform: scale(1.3);
}
</style>

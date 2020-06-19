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
    x="0"
    y="0"
    width="50px"
    height="50px"
  >
    <polygon points="17,10 40,25 17,40" />
  </svg>
</template>
<style scoped>
#play {
  transition: 0.3s;

  cursor: pointer;
}

#play:hover {
  transform: scale(1.3);
}
</style>

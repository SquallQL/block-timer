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
      return "fill:#ffffff;";
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
    width="40"
    height="40"
    x="0"
    y="0"
    viewBox="0 0 600 600"
    xml:space="preserve"
    @click="onClick"
  >
    <g>
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M70.846,324.059c3.21,3.926,8.409,3.926,11.619,0l69.162-84.621c3.21-3.926,1.698-7.108-3.372-7.108h-36.723    c-5.07,0-8.516-4.061-7.427-9.012c18.883-85.995,95.625-150.564,187.207-150.564c105.708,0,191.706,85.999,191.706,191.706    c0,105.709-85.998,191.707-191.706,191.707c-12.674,0-22.95,10.275-22.95,22.949s10.276,22.949,22.95,22.949    c131.018,0,237.606-106.588,237.606-237.605c0-131.017-106.589-237.605-237.606-237.605    c-116.961,0-214.395,84.967-233.961,196.409c-0.878,4.994-5.52,9.067-10.59,9.067H5.057c-5.071,0-6.579,3.182-3.373,7.108    L70.846,324.059z"
      />
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

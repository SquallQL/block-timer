import Vue from "vue";

const hide = {
  bind(el, binding) {
    el.style.visibility = binding.value ? "hidden" : "";
  },
  update(el, binding) {
    el.style.visibility = binding.value ? "hidden" : "";
  },
};

Vue.directive("hide", hide);

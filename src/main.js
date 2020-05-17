import Vue from "vue";
import App from "./App.vue";

import store from "./state/store";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  store,
}).$mount("#app");

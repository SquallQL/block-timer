import { createLocalVue, shallowMount } from "@vue/test-utils";
import { nextTick } from "vue";
import Vuex from "vuex";
import TimerSetupOptions from "../../src/components/timer-setup/TimerSetupOptions.vue";
import { timerMock } from "./mocks/timer_mock.js";
import { createStore } from "../state/store";

describe("TimerSetupOptions", () => {
  let wrapper;

  const defaultProps = {
    index: 0,
    isDisbled: false,
    timer: timerMock,
  };

  const localVue = createLocalVue();
  const store = createStore();
  const storeSpy = jest.spyOn(store, "dispatch");
  localVue.use(Vuex);

  const createWrapper = (props = {}) => {
    wrapper = shallowMount(TimerSetupOptions, {
      propsData: {
        ...defaultProps,
        ...props,
      },
      store,
      localVue,
    });
  };

  const findIntervalCheckbox = () =>
    wrapper.find(`#interval-${defaultProps.index}`);
  const findInfiniteCheckbox = () =>
    wrapper.find(`#repeat-${defaultProps.index}`);

  afterEach(() => {
    storeSpy.mockReset();
    wrapper.destroy();
  });

  describe("Interval timers", () => {
    beforeEach(() => {
      createWrapper();
    });

    it("Shows a checkbox to toggle timer type of interval", () => {
      expect(findIntervalCheckbox().exists()).toBe(true);
    });

    it("Shows a checkbox to toggle timer infinite state", () => {
      expect(findInfiniteCheckbox().exists()).toBe(true);
    });
  });

  describe("Actions", () => {
    beforeEach(() => {
      createWrapper();
    });

    it("send a VueX action to toggle the interval state", async () => {
      findIntervalCheckbox().trigger("click");

      await nextTick();

      expect(storeSpy.mock.calls).toEqual([
        ["toggleIntervalTimer", defaultProps.index],
      ]);
    });

    it("send a VueX action to toggle the infinite state", async () => {
      findInfiniteCheckbox().trigger("click");

      await nextTick();

      expect(storeSpy.mock.calls).toEqual([
        ["toggleInfiniteTimer", defaultProps.index],
      ]);
    });
  });
});

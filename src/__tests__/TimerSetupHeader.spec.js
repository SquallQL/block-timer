import { createLocalVue, shallowMount } from "@vue/test-utils";
import { nextTick } from "vue";
import Vuex from "vuex";
import TimerSetupHeader from "../../src/components/timer-setup/TimerSetupHeader.vue";
import { timerMock } from "./mocks/timer_mock.js";
import { createStore } from "../state/store";

jest.mock("lodash.debounce", () => jest.fn().mockImplementation((fn) => fn));
jest.useFakeTimers();

describe("TimerSetupHeader", () => {
  let wrapper;
  const defaultProps = {
    hasActiveBackground: false,
    hasRestBackground: false,
    index: 0,
    isEditable: true,
    timer: timerMock,
  };

  const localVue = createLocalVue();
  const store = createStore();
  const storeSpy = jest.spyOn(store, "dispatch");
  localVue.use(Vuex);

  const createWrapper = (props = {}) => {
    wrapper = shallowMount(TimerSetupHeader, {
      propsData: {
        ...defaultProps,
        ...props,
      },
      store,
      localVue,
    });
  };

  const findNameInput = () => wrapper.find("input");
  const findCloseBtn = () => wrapper.find("button");

  afterEach(() => {
    storeSpy.mockReset();
    wrapper.destroy();
  });

  describe("timer name", () => {
    beforeEach(() => {
      createWrapper();
      jest.resetAllMocks();
    });

    it("has a placeholder when no name was given", () => {
      expect(findNameInput().attributes("placeholder")).toBe(
        wrapper.vm.$options.i18n.placeholder
      );
    });

    it("calls the vueX action to set timer name on input", () => {
      const inputField = findNameInput();
      const newValue = "timer-name";

      inputField.element.value = newValue;
      inputField.trigger("input");
      jest.runOnlyPendingTimers();

      expect(storeSpy).toHaveBeenCalledWith("setTimerName", {
        id: defaultProps.index,
        name: newValue,
      });
    });
  });

  describe("background classes", () => {
    it("applies the Active background class when `hasActiveBackground` is true", () => {
      createWrapper({ hasActiveBackground: true, hasRestBackground: false });

      expect(findNameInput().classes()).toContain("timer-setup-active");
    });

    it("applies the Rest background class when `hasRestBackground` is true", () => {
      createWrapper({ hasActiveBackground: false, hasRestBackground: true });

      expect(findNameInput().classes()).toContain("timer-setup-rest");
    });
  });

  describe("close button", () => {
    it("calls the vueX action to set remove timer on click", async () => {
      await findCloseBtn().trigger("click");

      expect(storeSpy).toHaveBeenCalledWith("removeTimer", defaultProps.index);
    });
  });
});

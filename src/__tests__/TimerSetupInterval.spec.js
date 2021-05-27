import { createLocalVue, shallowMount } from "@vue/test-utils";
import { nextTick } from "vue";
import Vuex from "vuex";
import TimerSetupInterval from "../../src/components/timer-setup/TimerSetupInterval.vue";
import { timerMock } from "./mocks/timer_mock.js";
import { createStore } from "../state/store";

describe("TimerSetupInterval", () => {
  let wrapper;

  const defaultProps = {
    hasActiveBackground: false,
    hasRestBackground: false,
    index: 0,
    isActiveTimer: false,
    isStartBtnDisabled: false,
    timer: timerMock,
  };

  const localVue = createLocalVue();
  const store = createStore();
  const storeSpy = jest.spyOn(store, "dispatch");
  localVue.use(Vuex);

  const createWrapper = (props = {}) => {
    wrapper = shallowMount(TimerSetupInterval, {
      propsData: {
        ...defaultProps,
        ...props,
      },
      store,
      localVue,
    });
  };

  const activeIntervalCopy = "Active";
  const activeTimeCopy = "Time";

  const findAllSubtitles = () => wrapper.findAll(".subtitle");
  const findActiveText = () => findAllSubtitles().at(0);

  const findActiveInput = () => wrapper.find("[data-testid='activeInput'");
  const findRestInput = () => wrapper.find("[data-testid='restInput'");
  const findCycleInput = () => wrapper.find("[data-testid='cycleInput'");

  afterEach(() => {
    storeSpy.mockReset();
    wrapper.destroy();
  });

  describe("Interval timers", () => {
    beforeEach(() => {
      createWrapper();
    });

    it("Shows `active` text and not `time`", () => {
      expect(findActiveText().html()).toContain(activeIntervalCopy);
      expect(findActiveText().html()).not.toContain(activeTimeCopy);
    });

    it("Shows `active`, `rest` and `cycle` inputs", () => {
      expect(findActiveInput().exists()).toBe(true);
      expect(findRestInput().exists()).toBe(true);
      expect(findCycleInput().exists()).toBe(true);
    });
  });

  describe("Non-interval timers", () => {
    beforeEach(() => {
      createWrapper({ timer: { ...timerMock, isInterval: false } });
    });

    it("Shows `timer` text and not `active`", () => {
      expect(findActiveText().html()).not.toContain(activeIntervalCopy);
      expect(findActiveText().html()).toContain(activeTimeCopy);
    });

    it("Shows `active` and `cycle`, but hides `rest` inputs", () => {
      expect(findActiveInput().exists()).toBe(true);
      expect(findRestInput().exists()).toBe(false);
      expect(findCycleInput().exists()).toBe(true);
    });
  });

  describe("Infinite  timers", () => {
    beforeEach(() => {
      createWrapper({ timer: { ...timerMock, isInfinite: true } });
    });

    it("Shows infinite symbol", () => {
      expect(wrapper.html()).toContain("∞");
    });

    it("hides the cycle edit field to prevent modification", () => {
      expect(findCycleInput().exists()).toBe(false);
    });
  });

  describe("Non-infinite  timers", () => {
    beforeEach(() => {
      createWrapper();
    });

    it("Doesn't show an infinite symbol", () => {
      expect(wrapper.html()).not.toContain("∞");
    });

    it("show the cycle edit field", () => {
      expect(findCycleInput().exists()).toBe(true);
    });
  });

  describe("Actions", () => {
    beforeEach(() => {
      createWrapper();
    });

    describe("Active field", () => {
      it("send a VueX action to set the new active value and total", async () => {
        const newValue = "1";
        const activeInputField = findActiveInput();

        activeInputField.element.value = newValue;
        activeInputField.trigger("input", {
          keyCode: 48,
        });

        await nextTick();

        expect(storeSpy.mock.calls).toEqual([
          [
            "setActiveTime",
            {
              activeTime: newValue,
              id: defaultProps.index,
            },
          ],
          [
            "setTimerTotalTime",
            {
              total: wrapper.vm.total,
              id: defaultProps.index,
            },
          ],
        ]);
      });
    });

    describe("Rest field", () => {
      it("send a VueX action to set the new rest value and total", async () => {
        const newValue = "40";
        const restInputField = findRestInput();

        restInputField.element.value = newValue;
        restInputField.trigger("input", {
          keyCode: 48,
        });

        await nextTick();

        expect(storeSpy.mock.calls).toEqual([
          [
            "setRestTime",
            {
              restTime: newValue,
              id: defaultProps.index,
            },
          ],
          [
            "setTimerTotalTime",
            {
              total: wrapper.vm.total,
              id: defaultProps.index,
            },
          ],
        ]);
      });
    });

    describe("Cycle field", () => {
      it("send a VueX action to set the new cycle value and total", async () => {
        const newValue = "80";
        const activeInputField = findCycleInput();

        activeInputField.element.value = newValue;
        activeInputField.trigger("input", {
          keyCode: 48,
        });

        await nextTick();

        expect(storeSpy.mock.calls).toEqual([
          [
            "setCycle",
            {
              cycle: newValue,
              id: defaultProps.index,
            },
          ],
          [
            "setTimerTotalTime",
            {
              total: wrapper.vm.total,
              id: defaultProps.index,
            },
          ],
        ]);
      });
    });
  });
});

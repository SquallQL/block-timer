import { shallowMount } from "@vue/test-utils";
import TimerSetupHeader from "../../src/components/timer-setup/TimerSetupHeader.vue";
import { timerMock } from "./mocks/timer_mock.js";

describe("TimerSetupHeader", () => {
  let wrapper;
  const defaultProps = {
    hasActiveBackground: false,
    hasRestBackground: false,
    index: 0,
    isEditable: true,
    timer: timerMock,
  };

  const createWrapper = () => {
    wrapper = shallowMount(TimerSetupHeader, {
      props: {
        ...defaultProps,
      },
    });
  };

  beforeEach(() => {
    createWrapper();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("timer name", () => {
    it("has a placeholder when no name was given", () => {
      expect(wrapper.html()).toContain(wrapper.vm.$options.i18n.placeholder);
    });
  });
});

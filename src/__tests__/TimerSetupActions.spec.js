import { shallowMount } from "@vue/test-utils";
import TimerSetupActions from "../../src/components/timer-setup/TimerSetupActions.vue";

describe("TimerSetupActions", () => {
  let wrapper;

  const defaultProps = {
    hasActiveBackground: false,
    hasRestBackground: false,
    isActiveTimer: false,
    isDisabled: false,
  };

  const createWrapper = (props = {}) => {
    wrapper = shallowMount(TimerSetupActions, {
      propsData: {
        ...defaultProps,
        ...props,
      },
    });
  };

  const startBtnCopy = "Start";
  const stopBtnCopy = "Stop";

  const findStartBtn = () => wrapper.find("button");
  const clickStartBtn = () => findStartBtn().trigger("click");

  afterEach(() => {
    wrapper.destroy();
  });

  it("Shows 'Start' copy when timer is not active", () => {
    createWrapper();

    expect(findStartBtn().text()).toBe(startBtnCopy);
  });

  it("Shows 'Stop' copy when timer is active", () => {
    createWrapper({ isActiveTimer: true });

    expect(findStartBtn().text()).toBe(stopBtnCopy);
  });

  it("emits 'start-btn-click' when button is clicked", async () => {
    createWrapper();

    expect(wrapper.emitted("start-btn-click")).toBeUndefined();

    await clickStartBtn();

    expect(wrapper.emitted("start-btn-click")).toHaveLength(1);
  });

  it("emits 'start-btn-enter' when button is hovered", async () => {
    createWrapper();

    expect(wrapper.emitted("start-btn-enter")).toBeUndefined();

    await findStartBtn().trigger("mouseenter");

    expect(wrapper.emitted("start-btn-enter")).toHaveLength(1);
  });

  it("emits 'start-btn-out' when button is mouse out", async () => {
    createWrapper();

    expect(wrapper.emitted("start-btn-out")).toBeUndefined();

    await findStartBtn().trigger("mouseleave");

    expect(wrapper.emitted("start-btn-out")).toHaveLength(1);
  });
});

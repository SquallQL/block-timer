import { shallowMount } from "@vue/test-utils";
import TimerSetupTotal from "!/timer-setup/TimerSetupTotal.vue";
import { intervalTimerMock } from "../../mocks/timer_mock";

describe("TimerSetupTotal", () => {
  let wrapper;

  const defaultProps = {
    timer: intervalTimerMock,
    isInfinite: false,
  };

  const createWrapper = (props = {}) => {
    wrapper = shallowMount(TimerSetupTotal, {
      propsData: {
        ...defaultProps,
        ...props,
      },
    });
  };

  const findTimeEl = () => wrapper.find("strong");
  const findInfiniteSymbol = () =>
    wrapper.find("[data-testid='infinite-symbol'");

  afterEach(() => {
    wrapper.destroy();
  });

  it("shows the time when it's not infinite", () => {
    createWrapper();

    expect(findTimeEl().exists()).toBe(true);
    expect(findTimeEl().text()).toBeDefined();
    expect(findInfiniteSymbol().exists()).toBe(false);
  });

  it("shows an infinite symbol and no time when it's infinite", () => {
    createWrapper({ isInfinite: true });

    const infiniteSymbol = findInfiniteSymbol();

    expect(findTimeEl().exists()).toBe(false);
    expect(infiniteSymbol.exists()).toBe(true);
    expect(infiniteSymbol.text()).toBe("∞");
  });
});

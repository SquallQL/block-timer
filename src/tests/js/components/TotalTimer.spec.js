import Vuex from "vuex";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import WorkoutBanner from "!/header/WorkoutBanner.vue";
import { createStore } from "~/state/store";
import { START_WORKOUT, STOP_WORKOUT } from "~/state/actionTypes";

jest.useFakeTimers();

describe("WorkoutBanner", () => {
  let wrapper;

  const localVue = createLocalVue();
  let store;
  localVue.use(Vuex);

  const createWrapper = () => {
    wrapper = shallowMount(WorkoutBanner, {
      store,
      localVue,
    });
  };

  const findTotalWorkoutTimer = () =>
    wrapper.find("[data-testId='total-workout-timer']");

  beforeEach(() => {
    store = createStore();
    createWrapper();
  });

  afterEach(() => {
    wrapper.destroy();
    jest.clearAllTimers();
  });

  it("display 00s when the timer has not begun", () => {
    expect(findTotalWorkoutTimer().exists()).toBe(true);
    expect(findTotalWorkoutTimer().text()).toBe("00s");
  });

  describe("when the workout is ongoing", () => {
    beforeEach(async () => {
      await store.dispatch(START_WORKOUT);
    });

    it("display 01s when the timer has ticked once", async () => {
      await jest.advanceTimersToNextTimer();

      expect(findTotalWorkoutTimer().exists()).toBe(true);
      expect(findTotalWorkoutTimer().text()).toBe("01s");
    });

    it("display 10s when the timer has ticked 10 times", async () => {
      await jest.advanceTimersToNextTimer(10);

      expect(findTotalWorkoutTimer().exists()).toBe(true);
      expect(findTotalWorkoutTimer().text()).toBe("10s");
    });

    it("stops ticking when the user stops the workout", async () => {
      await jest.advanceTimersToNextTimer();

      expect(findTotalWorkoutTimer().text()).toBe("01s");

      await store.dispatch(STOP_WORKOUT);

      await jest.advanceTimersToNextTimer(10);

      expect(findTotalWorkoutTimer().text()).toBe("01s");
    });
  });
});

import Vuex from "vuex";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import MainTimer from "!/main-timer/MainTimer.vue";
import { createStore } from "~/state/store";
import { START_TIMER, SET_CYCLE } from "~/state/actionTypes";
import {
  intervalTimerMock,
  rawTimerMock,
  infiniteTimerMock,
} from "../mocks/timer_mock.js";
import {
  SHORT_BEEP_ID,
  LONG_BEEP_ID,
  END_BEEP_ID,
} from "../../../constants/constants";

jest.useFakeTimers();

describe("MainTimer", () => {
  let wrapper;

  const localVue = createLocalVue();
  let store;
  localVue.use(Vuex);

  const createWrapper = () => {
    wrapper = shallowMount(MainTimer, {
      store,
      localVue,
    });
  };

  const findGettingReady = () => wrapper.find("[data-testId='getting-ready']");
  const findActiveTime = () => wrapper.find("[data-testId='active-time']");
  const findCycles = () => wrapper.find("[data-testId='cycle-count']");

  let elementIdSpy;
  let playSpy;
  let pauseSpy;

  beforeEach(() => {
    const sounds = [SHORT_BEEP_ID, LONG_BEEP_ID, END_BEEP_ID];

    sounds.forEach((id) => {
      const soundEl = document.createElement("audio");

      soundEl.id = id;

      document.body.appendChild(soundEl);

      elementIdSpy = jest.spyOn(document, "getElementById");
      pauseSpy = jest
        .spyOn(window.HTMLMediaElement.prototype, "pause")
        .mockImplementation(() => {});

      playSpy = jest
        .spyOn(window.HTMLMediaElement.prototype, "play")
        .mockImplementation(() => {});
    });
  });

  const assertCountdownValue = ({ text, nbOfCalls, soundId }) => {
    expect(findActiveTime().exists()).toBe(true);
    expect(findActiveTime().text()).toBe(text);
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(
      nbOfCalls
    );
    expect(document.getElementById).toHaveBeenCalledTimes(nbOfCalls);
    expect(document.getElementById).toHaveBeenCalledWith(soundId);
  };

  const assertCountdown = async ({
    expectedTime,
    isGettingReady,
    isEnding,
  }) => {
    if (!isGettingReady) {
      playSpy.mockClear();
      pauseSpy.mockClear();
      elementIdSpy.mockClear();

      await jest.advanceTimersToNextTimer();
    }

    assertCountdownValue({ text: "03", nbOfCalls: 1, soundId: SHORT_BEEP_ID });

    await jest.advanceTimersToNextTimer();

    assertCountdownValue({ text: "02", nbOfCalls: 2, soundId: SHORT_BEEP_ID });

    await jest.advanceTimersToNextTimer();

    assertCountdownValue({ text: "01", nbOfCalls: 3, soundId: SHORT_BEEP_ID });

    await jest.advanceTimersToNextTimer();

    const endSound = isEnding ? END_BEEP_ID : LONG_BEEP_ID;

    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(4);
    expect(document.getElementById).toHaveBeenCalledTimes(4);
    expect(document.getElementById).toHaveBeenCalledWith(endSound);

    if (isEnding) {
      expect(findActiveTime().exists()).toBe(false);
    } else {
      expect(findActiveTime().exists()).toBe(true);
      expect(findActiveTime().text()).toBe(String(expectedTime));
    }
  };

  afterEach(() => {
    wrapper.destroy();
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  describe("plain timer", () => {
    beforeEach(async () => {
      store = createStore([rawTimerMock]);
      await createWrapper();
    });

    describe("before it's started", () => {
      it("does not render the getting ready text", () => {
        expect(findGettingReady().isVisible()).toBe(false);
      });
    });
    describe("when timer has started", () => {
      beforeEach(async () => {
        await store.dispatch(START_TIMER, 0);
      });

      it("counts down from 3 and start main timer", () => {
        return assertCountdown({
          isEnding: false,
          isGettingReady: true,
          expectedTime: rawTimerMock.active,
        });
      });

      it("shows the getting ready text", () => {
        expect(findGettingReady().isVisible()).toBe(true);
      });

      describe("when the getting ready reaches 0", () => {
        beforeEach(async () => {
          await jest.advanceTimersByTime(3000);
        });

        it("shows the cycles", () => {
          expect(findCycles().text()).toBe(`1/${rawTimerMock.cycle}`);
        });

        it("shows the right timer value", () => {
          expect(findActiveTime().text()).toBe(String(rawTimerMock.active));
        });

        it("hides the getting ready text", () => {
          expect(findGettingReady().isVisible()).toBe(false);
        });
      });

      describe("when active time is counting down from 3", () => {
        beforeEach(async () => {
          await jest.advanceTimersByTime(3000);
          await jest.advanceTimersByTime((rawTimerMock.active - 4) * 1000);
        });

        it("transition back to the active time with the correct sounds", () => {
          return assertCountdown({
            isEnding: false,
            isGettingReady: false,
            expectedTime: rawTimerMock.active,
          });
        });
      });

      describe("when active time countdown reaches 0", () => {
        beforeEach(async () => {
          await jest.advanceTimersByTime(3000);
          await jest.advanceTimersByTime((rawTimerMock.active - 1) * 1000);
        });

        it("advances the cycles ", async () => {
          expect(findCycles().text()).toBe(`1/${rawTimerMock.cycle}`);

          await jest.advanceTimersToNextTimer();

          expect(findCycles().text()).toBe(`2/${rawTimerMock.cycle}`);
        });
      });
    });
  });

  describe("with an interval timer", () => {
    beforeEach(async () => {
      store = createStore([intervalTimerMock]);
      await createWrapper();
    });

    describe("before the timer has started", () => {
      it("does not render the getting ready text", () => {
        expect(findGettingReady().isVisible()).toBe(false);
      });
    });

    describe("when timer has started", () => {
      beforeEach(async () => {
        await store.dispatch(START_TIMER, 0);
      });

      it("shows the active time", () => {
        expect(findGettingReady().isVisible()).toBe(true);
      });

      it("counts down from 3 and start main timer", () => {
        return assertCountdown({
          isEnding: false,
          isGettingReady: true,
          expectedTime: intervalTimerMock.active,
        });
      });
    });

    describe("when the timer is in active state", () => {
      beforeEach(async () => {
        await store.dispatch(START_TIMER, 0);
      });

      describe("and countdown from 3", () => {
        beforeEach(async () => {
          await jest.advanceTimersByTime(3000);
          await jest.advanceTimersByTime((intervalTimerMock.active - 4) * 1000);
        });

        describe("with more cycles to go", () => {
          it("transition from active to rest", () => {
            return assertCountdown({
              isEnding: false,
              isGettingReady: false,
              expectedTime: intervalTimerMock.rest,
            });
          });

          it("does not advance the cycles ", async () => {
            expect(findCycles().text()).toBe(`1/${intervalTimerMock.cycle}`);

            await jest.advanceTimersToNextTimer();

            expect(findCycles().text()).toBe(`1/${intervalTimerMock.cycle}`);
          });
        });

        describe("with no more cycles to go", () => {
          const originalCycle = intervalTimerMock.cycle;

          beforeEach(() => {
            store.dispatch(SET_CYCLE, { id: 0, cycle: 1 });
          });

          afterEach(() => {
            store.dispatch(SET_CYCLE, {
              id: 0,
              cycle: originalCycle,
            });
          });

          it("transition from active to done with the correct sounds", () => {
            return assertCountdown({
              isEnding: true,
              isGettingReady: false,
              expectedTime: "00:00",
            });
          });
        });
      });
    });

    describe("when the timer is in rest state", () => {
      beforeEach(async () => {
        store = createStore([intervalTimerMock]);
        await createWrapper();

        await store.dispatch(START_TIMER, 0);
        await jest.advanceTimersByTime(3000);
        await jest.advanceTimersByTime(intervalTimerMock.active * 1000);
      });

      describe("when counting down from 3", () => {
        beforeEach(async () => {
          await jest.advanceTimersByTime((intervalTimerMock.rest - 4) * 1000);
        });

        it("transitions from rest to active with the correct sounds", () => {
          return assertCountdown({
            isEnding: false,
            isGettingReady: false,
            expectedTime: intervalTimerMock.active,
          });
        });
      });

      describe("when countdown reaches 0", () => {
        beforeEach(async () => {
          await jest.advanceTimersByTime((intervalTimerMock.rest - 1) * 1000);
        });

        it("advances the cycles ", async () => {
          expect(findCycles().text()).toBe(`1/${intervalTimerMock.cycle}`);

          await jest.advanceTimersToNextTimer();

          expect(findCycles().text()).toBe(`2/${intervalTimerMock.cycle}`);
        });
      });
    });
  });

  describe("when the timer is infinite", () => {
    beforeEach(async () => {
      store = createStore([infiniteTimerMock]);
      await createWrapper();
      store.dispatch(START_TIMER, 0);
      await jest.advanceTimersByTime(3000);
    });

    it("shows the infinite symbol", () => {
      expect(findCycles().text()).toContain("∞");
    });
  });

  describe("when timer time is less than 3 seconds", () => {
    describe("for an interval timer", () => {
      describe("with 2 seconds of active and rest time", () => {
        const timeValue = 2;

        beforeEach(async () => {
          store = createStore([
            { ...intervalTimerMock, active: timeValue, rest: timeValue },
          ]);
          await createWrapper();
          await store.dispatch(START_TIMER, 0);
          await jest.advanceTimersByTime(2000);

          playSpy.mockClear();
          pauseSpy.mockClear();
          elementIdSpy.mockClear();
        });

        it("calls the right sound and transition to rest", async () => {
          await jest.advanceTimersToNextTimer();

          assertCountdownValue({
            text: "02",
            nbOfCalls: 1,
            soundId: LONG_BEEP_ID,
          });

          await jest.advanceTimersToNextTimer();

          assertCountdownValue({
            text: "01",
            nbOfCalls: 2,
            soundId: SHORT_BEEP_ID,
          });

          await jest.advanceTimersToNextTimer();

          assertCountdownValue({
            text: `0${timeValue}`,
            nbOfCalls: 3,
            soundId: LONG_BEEP_ID,
          });
        });
      });

      describe("with 1 second of active and rest time", () => {
        const timeValue = 1;

        beforeEach(async () => {
          store = createStore([
            { ...intervalTimerMock, active: timeValue, rest: timeValue },
          ]);
          await createWrapper();
          await store.dispatch(START_TIMER, 0);
          await jest.advanceTimersByTime(2000);

          playSpy.mockClear();
          pauseSpy.mockClear();
          elementIdSpy.mockClear();
        });

        it("calls the right sounds and transition to rest", async () => {
          await jest.advanceTimersToNextTimer();

          assertCountdownValue({
            text: `0${timeValue}`,
            nbOfCalls: 1,
            soundId: LONG_BEEP_ID,
          });

          await jest.advanceTimersToNextTimer();

          assertCountdownValue({
            text: `0${timeValue}`,
            nbOfCalls: 2,
            soundId: LONG_BEEP_ID,
          });
        });
      });
    });

    describe("for a plain timer", () => {
      describe("with 2 seconds of active time", () => {
        beforeEach(async () => {
          store = createStore([{ ...rawTimerMock, active: 2 }]);
          await createWrapper();
          await store.dispatch(START_TIMER, 0);
          await jest.advanceTimersByTime(2000);

          playSpy.mockClear();
          pauseSpy.mockClear();
          elementIdSpy.mockClear();
        });

        it("calls the right sound and transition to active", async () => {
          await jest.advanceTimersToNextTimer();

          assertCountdownValue({
            text: "02",
            nbOfCalls: 1,
            soundId: LONG_BEEP_ID,
          });

          await jest.advanceTimersToNextTimer();

          assertCountdownValue({
            text: "01",
            nbOfCalls: 2,
            soundId: SHORT_BEEP_ID,
          });

          await jest.advanceTimersToNextTimer();

          assertCountdownValue({
            text: "02",
            nbOfCalls: 3,
            soundId: LONG_BEEP_ID,
          });
        });
      });

      describe("with 1 second of active and rest time", () => {
        beforeEach(async () => {
          store = createStore([{ ...rawTimerMock, active: 1 }]);
          await createWrapper();
          await store.dispatch(START_TIMER, 0);
          await jest.advanceTimersByTime(2000);

          playSpy.mockClear();
          pauseSpy.mockClear();
          elementIdSpy.mockClear();
        });

        it("calls the right sound and transition to active time", async () => {
          await jest.advanceTimersToNextTimer();

          assertCountdownValue({
            text: "01",
            nbOfCalls: 1,
            soundId: LONG_BEEP_ID,
          });

          await jest.advanceTimersToNextTimer();

          assertCountdownValue({
            text: "01",
            nbOfCalls: 2,
            soundId: LONG_BEEP_ID,
          });
        });
      });
    });
  });
});

import Vuex from "vuex";
import Vue from "vue";

import * as types from "./actionTypes";

Vue.use(Vuex);

const defaultTimer = {
  isInterval: true,
  isInfinite: false,
  active: 30,
  rest: 10,
  cycle: 3,
};

export default new Vuex.Store({
  state: {
    selectedTimerID: 0,
    currentRun: {
      cycle: 1,
      isActive: false,
      time: 0,
    },
    timers: [
      defaultTimer,
      {
        isInterval: false,
        isInfinite: true,
        active: 60,
        rest: 0,
        cycle: 0,
      },
    ],
  },
  getters: {
    currentRun: (state) => state.currentRun,
    currentRunningTimer: (state) => state.timers[state.selectedTimerID],
    selectedTimerID: (state) => state.selectedTimerID,
    timers: (state) => state.timers,
  },
  mutations: {
    addTimer(state) {
      state.timers.push(defaultTimer);
    },
    removeTimer(state, id) {
      state.timers = state.timers.filter((_, index) => index !== id);
    },
    toggleTimer(state, id) {
      state.selectedTimerID = id;
      state.currentRun.isActive = !state.currentRun.isActive;
      if (state.currentRun.isActive) {
        state.currentRun.time = state.timers[id].active;
      }
    },
    setActiveTime(state, { id, value }) {
      const updateTimer = findTimer(state, id);
      return (updateTimer.active = value);
    },
    setRestTime(state, { id, value }) {
      const updateTimer = findTimer(state, id);
      return (updateTimer.rest = value);
    },
    setCycle(state, { id, value }) {
      const updateTimer = findTimer(state, id);
      return (updateTimer.cycle = value);
    },
    toggleIntervalTimer(state, id) {
      const updateTimer = findTimer(state, id);
      return (updateTimer.isInterval = !updateTimer.isInterval);
    },
    toggleInfiniteTimer(state, id) {
      const updateTimer = findTimer(state, id);
      return (updateTimer.isInfinite = !updateTimer.isInfinite);
    },
  },
  actions: {
    addTimer({ commit }) {
      commit(types.ADD_TIMER);
    },
    removeTimer({ commit }, id) {
      commit(types.REMOVE_TIMER, id);
    },
    toggleTimer({ commit }, id) {
      commit(types.START_TIMER, id);
    },
    setSelectedTimerID({ commit }, id) {
      commit(types.SET_SELECTED_TIMER_ID, id);
    },
    setActiveTime({ commit }, { id, activeTime }) {
      commit(types.SET_ACTIVE_TIMER, { id, activeTime });
    },
    setRestTime({ commit }, { id, restTime }) {
      commit(types.SET_REST_TIMER, { id, restTime });
    },
    setCycle({ commit }, { id, cycle }) {
      commit(types.SET_CYCLE, { id, cycle });
    },
    toggleIntervalTimer({ commit }, id) {
      commit(types.TOGGLE_INTEVAL_TIMER, id);
    },
    toggleInfiniteTimer({ commit }, id) {
      commit(types.TOGGLE_INFINITE_TIMER, id);
    },
  },
});

function findTimer(state, id) {
  return state.timers.find((_, index) => index === id);
}

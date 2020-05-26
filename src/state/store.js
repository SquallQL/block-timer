import Vuex from "vuex";
import Vue from "vue";

import * as types from "./actionTypes";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedTimerID: 0,
    currentRun: {
      cycle: 0,
      isActive: false,
    },
    timers: [
      {
        isInterval: true,
        isInfinite: false,
        active: 30,
        rest: 10,
        cycle: 3,
      },
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
    addTimer(state, data) {
      state.timers.push(data);
    },
    removeTimer(state, id) {
      state.timers = state.timers.filter((_, index) => index !== id);
    },
    setSelectedTimerID(state, id) {
      state.selectedTimerID = id;
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
    addTimer({ commit }, timerData) {
      commit(types.ADD_TIMER, timerData);
    },
    removeTimer({ commit }, id) {
      commit(types.REMOVE_TIMER, id);
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

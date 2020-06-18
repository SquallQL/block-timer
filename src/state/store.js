import Vuex from "vuex";
import Vue from "vue";

import * as types from "./actionTypes";
import { READY_STATE } from "../constants/constants";

Vue.use(Vuex);

const defaultTimer = {
  isInterval: true,
  isInfinite: false,
  active: 30,
  rest: 30,
  cycle: 20,
};

export default new Vuex.Store({
  state: {
    selectedTimerID: 0,
    isWorkoutStarted: false,
    currentRun: {
      cycle: 0,
      time: 0,
      isActive: false,
      isPaused: false,
      state: READY_STATE,
    },
    timers: [
      { ...defaultTimer },
      {
        isInterval: false,
        isInfinite: false,
        active: 60,
        rest: 10,
        cycle: 1,
      },
    ],
  },
  getters: {
    isWorkoutStarted: (state) => state.isWorkoutStarted,
    currentRun: (state) => state.currentRun,
    currentRunningTimer: (state) => state.timers[state.selectedTimerID],
    selectedTimerID: (state) => state.selectedTimerID,
    timers: (state) => state.timers,
  },
  mutations: {
    addTimer(state) {
      state.timers.push({ ...defaultTimer });
    },
    removeTimer(state, id) {
      state.timers = state.timers.filter((_, index) => index !== id);
    },
    togglePause(state) {
      state.currentRun.isPaused = !state.currentRun.isPaused;
    },
    toggleTimer(state, id) {
      if (id !== state.selectedTimerID) {
        state.selectedTimerID = id;
      } else {
        state.currentRun.isActive = !state.currentRun.isActive;
      }

      state.currentRun.isPaused = false;
      state.currentRun.state = READY_STATE;
    },
    setCurrentRunState(state, timerState) {
      state.currentRun.state = timerState;
    },
    toggleWorkoutStarted(state) {
      state.isWorkoutStarted = !state.isWorkoutStarted;
    },
    addCycle(state) {
      state.currentRun.cycle += 1;
    },
    resetCycle(state) {
      state.currentRun.cycle = 0;
    },
    setActiveTime(state, { id, activeTime }) {
      const updateTimer = findTimer(state, id);
      return (updateTimer.active = activeTime);
    },
    setRestTime(state, { id, restTime }) {
      const updateTimer = findTimer(state, id);
      return (updateTimer.rest = restTime);
    },
    setCycle(state, { id, cycle }) {
      const updateTimer = findTimer(state, id);
      return (updateTimer.cycle = cycle);
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
    togglePause({ commit }) {
      commit(types.TOGGLE_PAUSE);
    },
    setCurrentRunState({ commit }, timerState) {
      commit(types.SET_CURRENT_RUN_STATE, timerState);
    },
    toggleWorkoutStarted({ commit }) {
      commit(types.TOGGLE_WORKOUT_STARTED);
    },
    addCycle({ commit }) {
      commit(types.ADD_CYCLE);
    },
    resetCycle({ commit }) {
      commit(types.RESET_CYCLE);
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

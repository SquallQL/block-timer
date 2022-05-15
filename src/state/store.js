import Vuex from "vuex";
import Vue from "vue";

import * as types from "./actionTypes";
import { READY_STATE } from "../constants/constants";

Vue.use(Vuex);

const intervalActiveDefaut = 30;
const intervalRestDefault = 10;
const intervalCycleDefault = 10;

const activeDefault = 60;
const cycleDefault = 1;

let lastUID = 1;

const defaultInvervalTimer = {
  name: "",
  isInterval: true,
  isInfinite: false,
  active: intervalActiveDefaut,
  rest: intervalRestDefault,
  cycle: intervalCycleDefault,
  total: (intervalActiveDefaut + intervalRestDefault) * intervalCycleDefault,
  ready: 3,
  uid: 0,
};

const defaultTimer = {
  uid: 1,
  isInterval: false,
  isInfinite: false,
  active: activeDefault,
  cycle: cycleDefault,
  rest: 10,
  total: activeDefault * cycleDefault,
  ready: 3,
};

export const createStore = (
  defaultTimers = [defaultInvervalTimer, defaultTimer]
) =>
  new Vuex.Store({
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
      timers: defaultTimers,
    },
    getters: {
      isWorkoutStarted: (state) => state.isWorkoutStarted,
      currentRun: (state) => state.currentRun,
      currentTimerSettings: (state) => state.timers[state.selectedTimerID],
      selectedTimerID: (state) => state.selectedTimerID,
      timers: (state) => state.timers,
    },
    mutations: {
      addTimer(state) {
        lastUID += 1;
        state.timers.push({ ...defaultTimer, uid: lastUID });
      },
      setTimerName(state, { id, name }) {
        const updateTimer = findTimer(state, id);
        return (updateTimer.name = name);
      },
      setTimerTotalTime(state, { id, total }) {
        const updateTimer = findTimer(state, id);
        return (updateTimer.total = total);
      },
      removeTimer(state, id) {
        Vue.set(
          state,
          "timers",
          state.timers.filter((_, index) => index !== id)
        );
      },
      togglePause(state) {
        state.currentRun.isPaused = !state.currentRun.isPaused;
      },
      startTimer(state) {
        state.currentRun.isActive = true;
      },
      stopTimer(state) {
        state.currentRun.isActive = false;
      },
      toggleTimer(state, id) {
        if (id !== state.selectedTimerID) {
          state.selectedTimerID = id;
          state.currentRun.isActive = true;
        } else {
          state.currentRun.isActive = !state.currentRun.isActive;
        }

        state.currentRun.isPaused = false;
        state.currentRun.state = READY_STATE;
      },
      setCurrentRunState(state, timerState) {
        state.currentRun.state = timerState;
      },
      startWorkout(state) {
        state.isWorkoutStarted = true;
      },
      stopWorkout(state) {
        state.isWorkoutStarted = false;
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
      setTimerName({ commit }, { id, name }) {
        commit(types.SET_TIMER_NAME, { id, name });
      },
      setTimerTotalTime({ commit }, { id, total }) {
        commit(types.SET_TIMER_TOTAL_TIME, { id, total });
      },
      removeTimer({ commit }, id) {
        commit(types.REMOVE_TIMER, id);
      },
      startTimer({ commit }, id) {
        commit(types.START_TIMER, id);
      },
      stopTimer({ commit }) {
        commit(types.STOP_TIMER);
      },
      toggleTimer({ commit }, id) {
        commit(types.TOGGLE_TIMER, id);
      },
      togglePause({ commit }) {
        commit(types.TOGGLE_PAUSE);
      },
      setCurrentRunState({ commit }, timerState) {
        commit(types.SET_CURRENT_RUN_STATE, timerState);
      },
      startWorkout({ commit }) {
        commit(types.START_WORKOUT);
      },
      stopWorkout({ commit }) {
        commit(types.STOP_WORKOUT);
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
        commit(types.TOGGLE_INTERVAL_TIMER_TIMER, id);
      },
      toggleInfiniteTimer({ commit }, id) {
        commit(types.TOGGLE_INFINITE_TIMER, id);
      },
    },
  });

function findTimer(state, id) {
  return state.timers.find((_, index) => index === id);
}

export default createStore;

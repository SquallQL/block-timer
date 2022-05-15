export const intervalTimerMock = {
  active: 30,
  cycle: 20,
  isInfinite: false,
  isInterval: true,
  name: "",
  ready: 3,
  rest: 10,
  uid: 0,
  total: 1200,
};

export const rawTimerMock = {
  active: 45,
  cycle: 10,
  isInfinite: false,
  isInterval: false,
  name: "",
  ready: 3,
  rest: 20,
  uid: 1,
  total: 450,
};

export const infiniteTimerMock = {
  ...rawTimerMock,
  uid: 2,
  isInfinite: true,
};

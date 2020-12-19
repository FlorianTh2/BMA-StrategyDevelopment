import { createReducer, on } from "@ngrx/store";
import { increment, decrement, reset } from "../actions/counter.action";

export const homeFeatureKey = "home";

export interface HomeReducerState {
  counter: number;
}

export const initialState: HomeReducerState = {
  counter: 0
};

const internalHomeReducer = createReducer(
  initialState,

  on(increment, (state: HomeReducerState) => {
    return {
      ...state,
      counter: state.counter + 1
    };
  }),

  on(decrement, (state: HomeReducerState) => {
    return {
      ...state,
      counter: state.counter - 1
    };
  }),

  on(reset, (state: HomeReducerState) => {
    return {
      ...state,
      counter: 0
    };
  })
);

export function homeReducer(state, action) {
  return internalHomeReducer(state, action);
}

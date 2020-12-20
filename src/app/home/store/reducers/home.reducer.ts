import { createReducer, on } from "@ngrx/store";
import { increment, decrement, reset } from "../actions/counter.action";
import * as fromRoot from "../../../store/reducers/root.reducer";

export const homeFeatureKey = "home";

export interface State {
  counter: number;
}

export const initialState: State = {
  counter: 0
};

const internalHomeReducer = createReducer(
  initialState,

  on(increment, (state: State) => {
    return {
      ...state,
      counter: state.counter + 1
    };
  }),

  on(decrement, (state: State) => {
    return {
      ...state,
      counter: state.counter - 1
    };
  }),

  on(reset, (state: State) => {
    return {
      ...state,
      counter: 0
    };
  })
);

export function homeReducer(state, action) {
  return internalHomeReducer(state, action);
}

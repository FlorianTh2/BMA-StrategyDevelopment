import { createReducer, on } from "@ngrx/store";
import { increment, decrement, reset } from "../actions/counter.action";
import * as fromRoot from "../../../store/reducers/root.reducer";
import { Counter } from "../../shared/models/counter";
import { EntityState } from "@ngrx/entity";

export const homeFeatureKey = "home";

// with actual model (like books or users) often used like
// export interface State extends EntityState<Book>
// { selectedBookId: string | null }
// stores like: {entities: Books[], selectedBookId: string | null}
// see https://github.com/ngrx/platform/blob/86a5662adacffc563c18c9d26d691d2d1ac0f8f0/projects/example-app/src/app/books/reducers/books.reducer.ts
// since we dont have multiple counter here we just directly extend Counter
export interface State extends Counter {}

export const initialState: State = {
  currentNumber: 0
};

const internalHomeReducer = createReducer(
  initialState,

  on(increment, (state: State) => {
    return {
      ...state,
      counter: state.currentNumber + 1
    };
  }),

  on(decrement, (state: State) => {
    return {
      ...state,
      counter: state.currentNumber - 1
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

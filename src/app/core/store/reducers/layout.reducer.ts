import { createReducer, on } from "@ngrx/store";

import { closeSidenav, openSidenav } from "../actions/layout.actions";

export const layoutFeatureKey = "layout";

export interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false
};

export const reducer = createReducer(
  initialState,
  // Even thought the `state` is unused, it helps infer the return type
  on(closeSidenav, (state) => ({ showSidenav: false })),
  on(openSidenav, (state) => ({ showSidenav: true }))
);

export function selectShowSidenav(state: State) {
  return state.showSidenav;
}

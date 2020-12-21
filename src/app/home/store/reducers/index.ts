import {
  Action,
  combineReducers,
  createFeatureSelector,
  createSelector
} from "@ngrx/store";

import * as fromHome from "./home.reducer";
import * as fromRoot from "../../../store/reducers/root.reducer";

export const homeFeatureKey = "home";

// overall State
// needed to later map overallState to only this part of state (here HomeState) that we (this specific module) need
export interface State extends fromRoot.State {
  [homeFeatureKey]: HomeState;
}

export interface HomeState {
  [fromHome.homeFeatureKey]: fromHome.State;
}

/** Provide reducer in AoT-compilation happy way */
export function reducers(state: HomeState | undefined, action: Action) {
  return combineReducers({
    [fromHome.homeFeatureKey]: fromHome.homeReducer
  })(state, action);
}

// maps from overall-State to this part of the state that this module needs (HomeState)
// gets: State
// returns HomeState
export const selectHomeState = createFeatureSelector<State, HomeState>(
  homeFeatureKey
);

// maps from all-modules-reducer-state to one-reducer-of-the-module-state
// gets: HomeState
// returns: State of the specific home-reducer-state
export const selectHomeReducerState = createSelector(
  selectHomeState,
  (state) => state.home as fromHome.State
);

import {
  Action,
  ActionReducerMap,
  combineReducers,
  createFeatureSelector
} from "@ngrx/store";

import * as fromHome from "./home.reducer";
import * as fromRoot from "../../../store/reducers/root.reducer";

export const homeFeatureKey = "home";

export interface HomeState {
  // error
  // in template angular can not infer the "home"-property
  [fromHome.homeFeatureKey]: fromHome.State;
}

export interface State extends fromRoot.State {
  [homeFeatureKey]: HomeState;
}

/** Provide reducer in AoT-compilation happy way */
export function reducers(state: HomeState | undefined, action: Action) {
  return combineReducers({
    [fromHome.homeFeatureKey]: fromHome.homeReducer
  })(state, action);
}

export const getHomeState = createFeatureSelector<State, HomeState>(
  homeFeatureKey
);

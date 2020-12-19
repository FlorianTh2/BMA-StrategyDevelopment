import {
  Action,
  ActionReducerMap,
  combineReducers,
  createFeatureSelector
} from "@ngrx/store";

import * as fromHome from "./home.reducer";

export const homeFeatureKey = "home";

export interface HomeState {
  [fromHome.homeFeatureKey]: fromHome.HomeReducerState;
}

/** Provide reducer in AoT-compilation happy way */
export function reducers(state: HomeState | undefined, action: Action) {
  return combineReducers({
    [fromHome.homeFeatureKey]: fromHome.homeReducer
  })(state, action);
}

export const getHomeState = createFeatureSelector<HomeState>(homeFeatureKey);

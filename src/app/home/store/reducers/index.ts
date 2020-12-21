// this reducer/index is the standartize interface / abstraction to use the reducers in this module
//  - if you want to use a reducer of this module (from inside oder outside of this module) you MUST call
//    this file
//  - the idea: every interaction with the reducer of this module happens though this abstraction
//  - so if a selector returns a state -> this state has to be configured in this reducer/index.ts file
//    since a reference to the actual reducer is not allowed
//  - question:a selector returns a "State"-Interface but you are not allowed to reference the actual reducer?
//    answer: a (final) selector of this module should in best case never return a state of the reducer
//      ->  for sure we have partial selectors with a somehow intermediate state, yea okay, but there should
//          there should be so specific selectors to enable a reducer-reference-free usage of this index.ts - file

import {
  Action,
  combineReducers,
  createFeatureSelector,
  createSelector
} from "@ngrx/store";

import * as fromCounter from "./counter.reducer";
import * as fromRoot from "../../../store/reducers/root.reducer";
import { Counter } from "../../shared/models/counter";

export const homeFeatureKey = "home";

// overall State
// needed to later map overallState to only this part of state (here HomeState) that we (this specific module) need
export interface State extends fromRoot.State {
  [homeFeatureKey]: HomeState;
}

// state of this modules reducers in general
export interface HomeState {
  [fromCounter.counterFeatureKey]: fromCounter.State;
}

export function reducers(state: HomeState | undefined, action: Action) {
  return combineReducers({
    [fromCounter.counterFeatureKey]: fromCounter.counterReducer
  })(state, action);
}

// pay attention to the name-pattern -> each selector is build on top of the other

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
  (state) => state.counter as fromCounter.State
);

// maps from one-reducer-of-the-module-state to the model class
// why? -> so we dont have to include the reducer-state-reference in the view angular-component (the view)
// somehow useless but in like normal szenarios we have this abstraction to map from the ReducerState
// to the actual property (see more in counterReducer)
export const selectHomeReducerStateCounter = createSelector(
  selectHomeReducerState,
  (state) => state as Counter
);

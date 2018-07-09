import { combineReducers } from 'redux-immutable';
import { mainReducer } from "./mainReducer";

export default function createRootReducer() {
  return combineReducers({ app: mainReducer });
}
import { combineReducers } from 'redux-immutable';
import { itemReducer } from './itemReducer';

export default function createRootReducer() {
  return combineReducers({
    app: itemReducer
  });
}
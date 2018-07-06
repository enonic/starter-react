import { combineReducers } from 'redux-immutable';
import { exampleReducer } from './exampleReducer';

export default function createRootReducer() {
  return combineReducers({
    example: exampleReducer
  });
}
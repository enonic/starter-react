import { createStore, applyMiddleware } from 'redux';
import { fromJS } from 'immutable';
// import { routerMiddleware } from 'react-router-redux';

import createRootReducer from './reducers/index';


export default function configureStore(initialState = {}, history) {
  
    const store = createStore(
        createRootReducer(),
        fromJS(initialState)
        // middelware
    );
  
    return store;
  }
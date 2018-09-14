import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import promiseMiddleware from 'redux-promise-middleware'

import reducers from './reducers'
const initialState = typeof window !== 'undefined' ? window.INITIAL_STATE  : {}




const store = createStore(reducers, initialState, applyMiddleware(thunk,promiseMiddleware()));

export default store
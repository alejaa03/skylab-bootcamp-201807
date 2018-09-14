import { createStore, applyMiddleware,compose } from 'redux';
import thunk from 'redux-thunk';


import reducers from '../client/redux/reducers';

export default () => {
    const store = createStore(
        reducers,
        {},
        compose(applyMiddleware(thunk))
    );

    return store;
};

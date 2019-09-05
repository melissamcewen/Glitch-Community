import React from 'react';
import { combineReducers, configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { Provider } from 'react-redux';
import { isBrowser } from 'Utils/constants';
import createHandlerMiddleware from './handler-middleware';
import * as currentUser from './current-user';
import * as resources from './resources';

const composeReducers = (...reducers) => reducers.reduce((l, r) => (state, action) => l(r(state, action), action));

const createStore = () =>
  configureStore({
    reducer: composeReducers(
      resources.topLevelReducer,
      combineReducers({
        currentUser: currentUser.reducer,
        resources: resources.reducer,
      }),
    ),
    middleware: [...getDefaultMiddleware(), createHandlerMiddleware(currentUser.handlers, resources.handlers)],
    devTools: isBrowser && window.ENVIRONMENT === 'dev',
  });

export default ({ children }) => {
  const [store] = React.useState(createStore);
  return <Provider store={store}>{children}</Provider>;
};

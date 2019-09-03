import React from 'react';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { Provider } from 'react-redux';
import { isBrowser } from 'Utils/constants';
import createHandlerMiddleware from './handler-middleware';
import * as currentUser from './current-user';
import * as resources from './resources';

const createStore = () =>
  configureStore({
    reducer: {
      currentUser: currentUser.reducer,
      resources: resources.reducer,
    },
    middleware: [...getDefaultMiddleware(), createHandlerMiddleware(currentUser.handlers, resources.handlers)],
    devTools: isBrowser && window.ENVIRONMENT === 'dev',
  });

export default ({ children }) => {
  const [store] = React.useState(createStore);
  return <Provider store={store}>{children}</Provider>;
};

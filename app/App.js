/** @flow */
import React from 'react';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import AppReducer from './src/reducers';
import AppWithNavigationState from './src/navigators/AppNavigator';
import { middleware } from './src/utils/redux';

const store = createStore(
  AppReducer,
  compose(applyMiddleware(thunk)),
);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

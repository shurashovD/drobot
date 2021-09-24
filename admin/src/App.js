import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store';
import { Routes } from './routes';
import { Alert } from './components/Alert'

export const App = () => {
  return (
      <BrowserRouter>
        <Provider store={store}>
          <Alert />
          <Routes />
        </Provider>
      </BrowserRouter>
  )
}


import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from './App'
import store from './redux/store'

ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <App/>
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Provider } from "react-redux";
import serialize from "serialize-javascript";
import App from "../client/App";

export default (req, store) => {
  const context = {}
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path} context={context}>
        <div>
          <App />
        </div>
      </StaticRouter>
    </Provider>
  );

return `
  <html>
    <head>
    <title>Never Be Alone</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="/assets/css/material-kit.css" type="text/css" rel="stylesheet"/>
    <link href="/assets/css/ReactToastify.min.css" type="text/css" rel="stylesheet">
    <link href="/assets/css/react-datepicker.min.css" type="text/css" rel="stylesheet">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">


    </head>
    <body>
      <div id="root">${content}</div>
      <script>
        window.INITIAL_STATE = ${serialize(store.getState())}
      </script>
      <script src="/bundle.js"></script>
      <script src="/assets/js/core/jquery.min.js"></script>
      <script src="/assets/js/core/popper.min.js"></script>
      <script src="/assets/js/core/bootstrap-material-design.min.js"></script>
      <script src="/assets/js/material-kit.min.js"></script>
      <script src="/assets/js/plugins/moment.min.js"></script>
      <script src="/assets/js/plugins/bootstrap-datetimepicker.js"></script>
      <script src="/assets/js/plugins/nouislider.min.js"></script>
    </body>
    
  </html>
  `;
};

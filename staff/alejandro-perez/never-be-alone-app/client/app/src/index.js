import "@babel/polyfill";
import express from "express";
import renderer from "./helpers/renderer";
import createStore from "./helpers/createStore";
import store from './client/redux/store'
import { matchRoutes } from "react-router-config";
import Routes from "./client/Routes";
import {} from 'dotenv'

const app = express();

const {
  env: { PORT },
} = process;

app.use(express.static("public"));
app.get("*",(req, res) => {
  const store = createStore();
  const branch = matchRoutes(Routes.routes, req.path)
  const promises = branch.map(({route,match}) => {
    return route.loadData ? route.loadData(store,match.params) : null;
  });
  Promise.all(promises).then(() => {
    res.send(renderer(req, store));
  });
});

app.listen(PORT || 4000, () => {
  console.log(`server on port 4000`);
});

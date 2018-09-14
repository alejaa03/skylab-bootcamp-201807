import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import NavBar from './components/NavBar'


import logic from '../logic'

import Routes from './Routes';

import PrivateRoute from '../utils/privateRoute';

class App extends Component {
    initApp = () => {
        logic.token = token => {
            if (typeof token !== 'undefined') {
                if (token === null) sessionStorage.removeItem('token');
                else sessionStorage.setItem('token', token);

                return;
            }

            return sessionStorage.getItem('token');
        };

        logic.userId = userId => {
            if (typeof userId !== 'undefined') {
                if (userId === null) sessionStorage.removeItem('userId');
                else sessionStorage.setItem('userId', userId);

                return;
            }

            return sessionStorage.getItem('userId');
        };
    };

    render() {
        this.initApp();

        const publicRoutes = Routes.routes.map(route => {
            return (
                <Route
                    path={route.path}
                    component={route.component}
                    exact={route.exact}
                    key={Math.random()}
                />
            );
        });

        const privateRoutes = Routes.privateRoutes.map(route => {
            return (
                <PrivateRoute
                    path={route.path}
                    component={route.component}
                    key={Math.random()}
                />
            );
        });

        return (
            <div>
                <NavBar />

                <Switch>{[...publicRoutes,...privateRoutes]}</Switch>
            </div>
        );
    }
}

export default withRouter(App);
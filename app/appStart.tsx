import "../app/grid/grid.scss"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createHashHistory } from 'history';
import * as React from 'react';
import * as reactDom from 'react-dom';
import { IndexRedirect, IndexRoute, Route, Router } from 'react-router';
import 'core-js/es6/promise';
import { Provider } from 'react-redux';
import * as AmoundData from "../state/AmountData"
import First from "./grid/containers/GridContainer"
import combineBudgetEditReducer from "../state/index"

var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();
start();

function start() {

    var history = createHashHistory();
    var node = document.getElementById('mainblock');

    var store = combineBudgetEditReducer();
    store.dispatch(AmoundData.Service.loadByCurrentCriteria());
    reactDom.render(
        <Provider store={store}>
            <MuiThemeProvider >
                <Router history={history}>
                    <Route path={"/"} component={First}>
                    </Route>
                </Router>
            </MuiThemeProvider >
        </Provider>,
        node
    );
}

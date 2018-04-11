import { createHashHistory } from 'history';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';
import * as reactDom from 'react-dom';
import { IndexRedirect, IndexRoute, Route, Router } from 'react-router';
import 'core-js/es6/promise';

import First from "./mainComponent"

var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();
start();

function start() {

    var history = createHashHistory();
    var node = document.getElementById('mainblock');

    reactDom.render(
        <MuiThemeProvider >
            <Router history={history}>
                <Route path={"/page"} component={First}>
                </Route>
            </Router>
        </MuiThemeProvider >,
        node
    );
}

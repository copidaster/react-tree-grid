import * as redux from 'redux';
import * as AmountData from "./AmountData"
import thunk from 'redux-thunk';

export class AppState {
    amountData: AmountData.State;
}

export default function combineBudgetEditReducer() {

    let combinedReducers:any = {};

    combinedReducers[AmountData.name] = AmountData.Reducer;

    let defaultState = {
        amountData: AmountData.DefaultState,
    };

    var precombinedReducers = redux.combineReducers(combinedReducers);


    let store= redux.createStore(
        precombinedReducers,
        defaultState,
        redux.compose(
            redux.applyMiddleware(thunk),
            window["devToolsExtension"] ? window["devToolsExtension"]() : f => f
        ));

        return store;
};

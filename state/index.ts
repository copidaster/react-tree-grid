import * as redux from 'redux';
import * as AmountData from "./AmountData"
import thunk from 'redux-thunk';

export class AppState {
    amountData: AmountData.State;
}

export default function combineBudgetEditReducer() {

    let combinedReducers: any = {};
    combinedReducers[AmountData.name] = AmountData.Reducer;

    let defaultState = {
        amountData: AmountData.DefaultState,
    };

    let devToolExtensin = "devToolsExtension";

    return redux.createStore(
        redux.combineReducers(combinedReducers),
        defaultState,
        redux.compose(
            redux.applyMiddleware(thunk),
            window[devToolExtensin] ? window[devToolExtensin]() : f => f
        )
    );
};

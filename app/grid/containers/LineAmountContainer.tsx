import { AppState } from 'state';
import * as React from 'react';
import * as reactRedux from 'react-redux';

import Component, { DispatchProps, StateProps } from '../components/LineAmountRow';
import * as AmmountData from '../../../state/AmountData';
import { throttle } from "lodash"

class OwnProps {
    lineId: string;
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => {

    if (state.amountData.isLoading) {
        return null;
    }
    var line = state.amountData.lines.find(item => item.id == ownProps.lineId);
    var data = state.amountData.computedTreeList.find(item => item.id == ownProps.lineId);

    var cells = null;
    if (line != null) cells = line.line;

    if (line == null) {
        throw Error('id ' + ownProps.lineId + " line is empty");
    }

    return {
        lineId: ownProps.lineId,
        cells: (!data.isCollapsed && data.isParent && !data.custom) ? null : cells,
        editable: !line.isParent,
        isCollapsed: data.isCollapsed,
        isVisible: data.isVisible
    }
}

const mapDispatchToProps = (dispatch, owmProps): DispatchProps => {
    return {
        onChange: (period, amount) => {
            dispatch(AmmountData.Service.saveAmounts(owmProps.lineId, period, amount));
        },
        onArrowMove: (keyCode: number, period: number) => {
            dispatch(AmmountData.Service.moveToCellThrottled(owmProps.lineId, period, keyCode));
        }
    }
}


export default reactRedux.connect(mapStateToProps, mapDispatchToProps)(Component);

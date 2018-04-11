import { AppState } from 'state/index';
import * as React from 'react';
import * as reactRedux from 'react-redux';

import Component, { DispatchProps, StateProps } from '../components/AccountWithTotalItem';
import * as AmmountData from '../../../state/AmountData';

class OwnProps {
    lineId: string;
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => {

    if (state.amountData.isLoading) {
        return null;
    }

    var line = state.amountData.computedTreeList.find(item => item.id == ownProps.lineId);
    var amount = state.amountData.lines.find(item => item.id == ownProps.lineId);

    if (amount == null) {
        console.error('id ' + ownProps.lineId + " amount is empty");
    }
    var total = amount.total;

    return { 
        lineId: ownProps.lineId,
        name: line.name,
        level: line.level,
        childrenCount: line.childrenLeaves.length + line.childrenParents.length,
        isParent: line.isParent,
        isNominated: line.isNominated,
        isInActive: line.isInactive,
        total: total,
        isCollapsed: line.isCollapsed,
        isVisible: line.isVisible,
        isCustom: line.custom
    }
}

const mapDispatchToProps = (dispatch, owmProps): DispatchProps => {
    return {
        collapse: () => {
            dispatch(AmmountData.Service.collapse(owmProps.lineId));
        },
        decollapse: () => {
            dispatch(AmmountData.Service.decolapse(owmProps.lineId));
        },
    }
}


export default reactRedux.connect(mapStateToProps, mapDispatchToProps)(Component);

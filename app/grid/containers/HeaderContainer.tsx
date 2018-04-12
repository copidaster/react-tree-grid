import { AppState } from 'state';
import * as reactRedux from 'react-redux';
import * as AmmountData from "../../../state/AmountData"

import Header, { StateProps, DispatchProps } from "../components/Header"

const mapStateToProps = (state: AppState, ownProps): StateProps => {
    if (state.amountData.computedTreeList == null || state.amountData.lines == null) {

        return { canRedo: false, canUndo: false }
    }

    return { canRedo: AmmountData.Service.Manager.canRedo(), canUndo: AmmountData.Service.Manager.canUndo() };
}

const mapDispatchToProps = (dispatch, owmProps): DispatchProps => {
    return {
        undo: () => {
            AmmountData.Service.undo();
        },
        redo: () => {
            AmmountData.Service.redo();
        },
    }
}

export default reactRedux.connect(mapStateToProps, mapDispatchToProps)(Header);

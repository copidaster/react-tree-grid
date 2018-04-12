import { AppState } from 'state';
import * as reactRedux from 'react-redux';
import LabelComponent, { StateProps } from "../components/TreeLabel"

const mapStateToProps = (state: AppState, ownProps): StateProps => {

    let isReady = true;

    if (state.amountData.computedTreeList == null || state.amountData.lines == null) {
        isReady = false;
    }

    return {
        ready: isReady
    }
}

export default reactRedux.connect(mapStateToProps)(LabelComponent);
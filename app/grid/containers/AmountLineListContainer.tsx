import { AppState } from 'state';
import * as React from 'react';
import * as reactRedux from 'react-redux';

import LineAmountRow from './LineAmountContainer';

class StateProps {
    lineIdList: Array<string>;
}

class Decorator extends React.Component<StateProps, {}> {

    render() {
        return <div id={'scroll-budgets-vert'} style={{ width: '100%', position: 'relative', overflowX: 'hidden', overflowY: 'hidden' }}>
            <div style={{ position: 'absolute' }}>
                {this.props.lineIdList.map(item => <LineAmountRow lineId={item} />)}
            </div>
        </div>
    }
}

const mapStateToProps = (state: AppState, ownProps): StateProps => {
    if (state.amountData.computedTreeList == null || state.amountData.lines == null) {
        return { lineIdList: [] }
    }

    return {
        lineIdList: state.amountData.computedTreeList.map(item => item.id),
    }
}

export default reactRedux.connect(mapStateToProps)(Decorator);
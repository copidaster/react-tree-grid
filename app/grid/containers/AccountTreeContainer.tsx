import { AppState } from 'state/index';
import * as React from 'react';
import * as reactRedux from 'react-redux';

import AccountItem from './AccounWithTotaltemContainer';

class StateProps {
    lineIdList: Array<string>;
}

class Decorator extends React.Component<StateProps, {}> {

    render() {
        return <div>
            {this.props.lineIdList.map(item => <AccountItem lineId={item} />)}
        </div>
    }
}

const mapStateToProps = (state: AppState, ownProps): StateProps => {
    if (state.amountData.computedTreeList == null || state.amountData.lines == null) {
        return { lineIdList: [] }
    }

    return {
        lineIdList: state.amountData.computedTreeList.map(item => item.id)
    }
}

export default reactRedux.connect(mapStateToProps)(Decorator);

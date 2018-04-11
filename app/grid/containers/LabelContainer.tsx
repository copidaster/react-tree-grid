import { AppState } from 'state';
import * as React from 'react';
import * as reactRedux from 'react-redux';

class StateProps {
    ready: boolean;
}

class Decorator extends React.Component<StateProps, {}> {
    render() {
        if (!this.props.ready) return null;
        return <div style={{ display: 'flex', alignItems: 'center', color: '#999999' }}>
            <div className={"account"} style={{ height: 50, display: 'flex', alignItems: 'center', border: 'none' }}>
                <span style={{ marginLeft: 10 }}>ACCOUNT</span>
            </div>
            <div className={"total"} style={{ height: '100%', borderBottom: 'none', display: 'flex' }}>TOTAL</div>
        </div>
    }
}

const mapStateToProps = (state: AppState, ownProps): StateProps => {
    if (state.amountData.computedTreeList == null || state.amountData.lines == null) {
        return { ready: false }
    }

    return {
        ready: true
    }
}

export default reactRedux.connect(mapStateToProps)(Decorator);
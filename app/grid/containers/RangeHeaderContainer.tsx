import { AppState } from 'state';
import * as React from 'react';
import * as reactRedux from 'react-redux';

import LineHeaderView from '../components/LineAmountHeader';
import getMonthes, { Utility } from "../../../api/utils/PeriodUtility"

class StateProps {
    ranges: Array<number>;
}

class Decorator extends React.Component<StateProps, {}> {

    render() {

        var monthes = getMonthes();
        return <div id={'budget-scroll-sync'} style={{ width: '100%', position: 'relative', overflowY: 'hidden', overflowX: 'hidden' }}>
            <div style={{ position: 'absolute' }}>
                <div style={{ display: 'flex' }}>{this.props.ranges.map(item => {

                    var month = item.toString().substring(4);
                    var year = item.toString().substring(0, 4);
                    var label = monthes.find(inner => inner.id == Number.parseInt(month))

                    return <LineHeaderView year={year} month={label.title} />
                })}</div >
            </div>
        </div>
    }
}

const mapStateToProps = (state: AppState, ownProps): StateProps => {

    if (state.amountData.computedTreeList == null || state.amountData.lines == null) {
        return { ranges: state.amountData.lines[0].line.map(item => item.Period)}
    }

    return {
        ranges: state.amountData.lines[0].line.map(item => item.Period)
    }
}

export default reactRedux.connect(mapStateToProps)(Decorator);
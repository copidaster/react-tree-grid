import { AppState } from 'state';
import * as React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import * as reactRedux from 'react-redux';

import ContainerAccount from './AccountTreeContainer';
import ContainerAmount from './AmountLineListContainer';
import HeaderContainer from './HeaderContainer';
import LabelContainer from './LabelContainer';
import PeriodRangeContainer from './RangeHeaderContainer';

class DecoratorProps {
    isVisible: boolean;
    countOfPeriods: number;
}

class Decorator extends React.Component<DecoratorProps, {}> {

    private onScroll() {
        var scroll = document.getElementById('main-horiz');

        var scrollToSync = document.getElementById('budget-scroll-sync');
        var scrollToSync2 = document.getElementById('scroll-budgets-vert');

        scrollToSync.scroll(scroll.scrollLeft, scroll.scrollTop);
        scrollToSync2.scroll(scroll.scrollLeft, scroll.scrollTop);
    }

    render() {
        if (!this.props.isVisible) {
            return <div className={"budget-view budget-grid-box column-flex-grow"}> Loading.... </div>;
        }

        return <div className={"budget-view budget-grid-box column-flex-grow"} style={{ width: '100%', height: 800, border: '1px solid grey', display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
            <HeaderContainer />
            <div className={'budget-grid-header-container'}>
                <LabelContainer />
                <PeriodRangeContainer />
            </div>
            <Scrollbars >
                <div className={'row-flex-grow'} style={{ display: 'flex' }}>
                    <ContainerAccount />
                    <ContainerAmount />
                </div>
            </Scrollbars>
            <div style={{ marginLeft: 365, display: 'flex', position: 'relative' }}>
                <div id={'main-horiz'} onScroll={() => { this.onScroll(); }} className={'budget-scroll'} style={{ position: 'absolute', overflowX: 'scroll', width: '100%', top: 2 }} >
                    <div style={{ width: this.props.countOfPeriods * 82, height: 2, }} />
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = (state: AppState, ownProps): DecoratorProps => {
    if (state.amountData.computedTreeList != null && state.amountData.lines != null && !state.amountData.isLoading) {
        return { isVisible: true, countOfPeriods: state.amountData.lines[0].line.length }
    }

    return {
        isVisible: false,
        countOfPeriods: 0
    }
}

export default reactRedux.connect(mapStateToProps)(Decorator);
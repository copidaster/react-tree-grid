import * as React from 'react';

export default class HorizontalScroll extends React.Component<{ count: number, onScroll: () => void }, {}>
{
    render() {
        return <div style={{ marginLeft: 365, display: 'flex', position: 'relative' }}>
            <div id={'main-hroiz'} onScroll={() => { this.props.onScroll(); }} className={'budget-scroll'} style={{ position: 'absolute', overflowX: 'scroll', width: '100%', top: 2 }} >
                <div style={{ width: this.props.count * 82, height: 2 }} />
            </div>
        </div >
    }
}
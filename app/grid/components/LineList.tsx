import * as React from 'react';

export default class LineList extends React.Component<{}, {}> {

    render() {
        return <div id={'scroll-budgets-vert'} className={"hidden-scroll-container"}>
            <div style={{ position: 'absolute' }}>
               {this.props.children}
            </div>
        </div>
    }
}
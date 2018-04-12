import * as React from 'react';

export class StateProps {
    ready: boolean;
}

export default class Decorator extends React.Component<StateProps, {}> {
    render() {
        if (!this.props.ready) return null;
        return <div className={"tree-header"}>
            <div className={"account header"}>
                <span style={{ marginLeft: 10 }}>ACCOUNT</span>
            </div>
            <div className={"total static"}>TOTAL</div>
        </div>
    }
}

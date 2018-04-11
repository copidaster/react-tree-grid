import * as React from 'react';
import { Lock } from "material-ui-icons"

class AmountCellProps {
    year: string;
    month: string;
    isLocked: boolean;
}

export default class AmountCellView extends React.Component<AmountCellProps, {}>
{
    render() {

        var locked = '';
        if (this.props.isLocked) {
            locked = ' locked';
        }
        return <div className={'amount-cell-header ' + locked}>
            <div className={'label-year-container'}>
                <div className={"label-year"}>{this.props.year}</div>
                <div>{this.props.month}</div>
            </div>
            {this.props.isLocked && <Lock className={'lock-header-icon'} />}
        </div>
    }
}
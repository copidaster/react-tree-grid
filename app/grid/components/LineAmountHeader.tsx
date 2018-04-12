import * as React from 'react';
import { Lock } from "material-ui-icons"

class AmountCellProps {
    year: string;
    month: string;
}

export default class AmountCellView extends React.Component<AmountCellProps, {}>
{
    render() {
        return <div className={'amount-cell-header'}>
            <div className={'label-year-container'}>
                <div className={"label-year"}>{this.props.year}</div>
                <div>{this.props.month}</div>
            </div>
        </div>
    }
}
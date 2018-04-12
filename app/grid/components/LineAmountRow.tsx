import AmountCell from 'api/entity/AmountCell';
import * as React from 'react';
import AmountCellView from "./AmountCell"

export class StateProps {
    lineId: string;
    cells: Array<AmountCell>;
    editable: boolean;
    isCollapsed: boolean;
    isVisible: boolean;
}

export class DispatchProps {
    onChange: (period: number, amount: number) => void;
    onArrowMove: (keyCode: number, period: number) => void;
}

export default class LineAmountRow extends React.Component<StateProps & DispatchProps, {}>{

    render() {

        if (!this.props.isVisible) return null;

        var locked = '';
        if (!this.props.editable) {
            locked = 'locked'
        }

        return <div className={'amount-row ' + locked}>
            {
                this.props.cells != null
                    ?
                    this.props.cells.map(
                        item => {
                            return <AmountCellView
                                isLocked={false}
                                clickIdKey={"line-" + this.props.lineId + " " + "period-" + item.Period}
                                arrowMove={(keyCode) => {
                                    this.props.onArrowMove(keyCode, item.Period)
                                }}
                                amount={item.Amount}
                                onChange={(amount) => { this.props.onChange(item.Period, amount) }
                                }
                            />
                        }
                    )
                    :
                    <div className={'ammount-invisible-row'}>
                    </div>
            }
        </div>
    }
}

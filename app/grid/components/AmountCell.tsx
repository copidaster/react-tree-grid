import * as React from 'react';

class AmountCellProps {
    clickIdKey: string;
    amount: number;
    onChange: (newVal: number) => void;
    arrowMove: (keyCode: number) => void;
    isLocked: boolean;
}

class AmountCellState {
    amount: string;
    mode: number;
}

export default class AmountCellView extends React.Component<AmountCellProps, AmountCellState>
{
    private input: HTMLInputElement;

    private listener: EventListener;
    private keyDownListener: EventListener;

    private isTextBoxActivated: boolean;
    private nextWillbeMovingLeft: boolean;
    private leftEdgeWas: boolean;

    private nextWillbeMovingRight: boolean;
    private rightEdgeWas: boolean;

    constructor(props: AmountCellProps) {
        super(props);

        this.state = { amount: props.amount.toString(), mode: 1 }
        this.isTextBoxActivated = false;
        this.nextWillbeMovingLeft = false;
        this.nextWillbeMovingRight = false;

        this.keyDownListener = ((event: any) => {
            if ([38, 40].indexOf(event.keyCode) !== -1) {
                this.props.arrowMove(event.keyCode);
                event.preventDefault();
            }
            else if (!this.isTextBoxActivated && [37, 39].indexOf(event.keyCode) !== -1) {
                this.props.arrowMove(event.keyCode);
                event.preventDefault();
            }

        }).bind(this);

        this.listener = ((event: any) => {

            this.calibrateMovingFlags();

            if (event.keyCode == 39 && this.nextWillbeMovingRight) {

                this.nextWillbeMovingLeft = false;
                this.props.arrowMove(event.keyCode);
                event.preventDefault();
            }

            else if (event.keyCode === 37 && this.nextWillbeMovingLeft) {

                this.nextWillbeMovingRight = false;
                this.props.arrowMove(event.keyCode);
                event.preventDefault();
            }

            else if (event.keyCode === 13) {
                if (this.isTextBoxActivated) {
                    if (!(window as any).isNaN(this.state.amount as any)) {
                        this.props.onChange(Number(this.state.amount as any))
                        this.setMode(1);
                    }
                    else {
                        this.setState({ amount: this.props.amount.toString(), mode: this.state.mode });
                    }

                    this.props.arrowMove(40);
                    this.isTextBoxActivated = false;

                }
                else {
                    this.isTextBoxActivated = true;
                    this.input.setSelectionRange(this.input.value.length, this.input.value.length);
                }
            }

            else if (event.keyCode === 27) {
                if (this.isTextBoxActivated) {

                    this.setState({ amount: this.props.amount.toString(), mode: 2 })
                    this.input.setSelectionRange(this.input.value.length, this.input.value.length);
                }
            }
        }).bind(this);

    }

    private completeEditing() {
        this.isTextBoxActivated = false;
        if (!(window as any).isNaN(this.state.amount as any)) {
            this.props.onChange(Number(this.state.amount as any))
            this.setMode(1);
        }
        else {
            this.setState({ amount: this.props.amount.toString(), mode: this.state.mode });
        }

        this.setMode(1);
    }

    componentWillReceiveProps(props: AmountCellProps) {
        if (this.state.amount.toString() != props.amount.toString()) {
            this.setState({ amount: props.amount.toString(), mode: 1 })
        }
    }

    private setMode(mode) {
        this.setState((state) => {
            return { mode: mode, amount: state.amount };
        },
            () => {
                if (this.input != null && mode == 2) {
                    this.input.focus();
                    this.input.select();
                    this.input.addEventListener("keydown", this.keyDownListener);
                    this.input.addEventListener("keyup", this.listener);
                }
                else if (mode == 1) {
                    if (this.input != null) {
                        this.input.removeEventListener("keydown", this.keyDownListener);
                        this.input.removeEventListener("keyup", this.listener);
                        this.isTextBoxActivated = false;
                    }
                }
            }
        );
    }

    private calibrateMovingFlags() {
        var selectionStart = this.input.selectionStart;
        var selectionEnd = this.input.selectionEnd;
        this.nextWillbeMovingLeft = false;
        this.nextWillbeMovingRight = false;

        if (selectionStart == 0 && selectionEnd == 0) {
            if (this.leftEdgeWas) {
                this.nextWillbeMovingLeft = true;
            }
            else {
                this.leftEdgeWas = true;
            }
        }
        else if (selectionStart == this.state.amount.length && selectionEnd == this.state.amount.length) {
            if (this.rightEdgeWas) {
                this.nextWillbeMovingRight = true;
            }
            else {
                this.rightEdgeWas = true;
            }
        }
        else {
            this.leftEdgeWas = false;
            this.rightEdgeWas = false;
        }
    }

    render() {

        if (this.state.mode == 1) {

            let valueLabel = Math.round(Number(this.state.amount)).toLocaleString();
            var color = this.state.amount[0] == '-' ? " color-calxa-red" : "";
            var locked = this.props.isLocked ? ' locked-amount' : "";
            return <span title={valueLabel}>
                <div
                    id={this.props.clickIdKey}
                    onClick={() => {
                        if (!this.props.isLocked) {
                            this.setMode(2)
                        }
                    }}

                    className={"month open" + color + locked}
                >
                    {valueLabel}
                </div>
            </span>
        }
        return <input
            ref={(ref) => { this.input = ref }}
            className={"invisible-textbox"}
            value={this.state.amount}
            onClick={(e) => {
                this.isTextBoxActivated = true;
                this.calibrateMovingFlags();
            }}
            onChange={(e) => {
                this.isTextBoxActivated = true;
                this.calibrateMovingFlags();

                var amount: any = e.currentTarget.value;
                if (!(window as any).isNaN(amount)) {
                    this.setState({ amount: amount.toString(), mode: this.state.mode });
                }
                else if (amount == '' || amount == '-') {
                    this.setState({ amount: amount, mode: this.state.mode });
                }
            }}
            onBlur={() => {
                this.completeEditing();
            }}
        />
    }
}
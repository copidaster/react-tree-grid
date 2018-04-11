import { Add, MoneyOff, Remove, Visibility } from 'material-ui-icons';
import * as React from 'react';

export class StateProps {
    lineId: string;
    name: string;
    total: number;
    isParent: boolean;
    childrenCount: number;
    level: number;
    isInActive: boolean;
    isNominated: boolean;
    isCollapsed: boolean;
    isVisible: boolean;
    isCustom: boolean;
}

export class DispatchProps {
    collapse: () => void;
    decollapse: () => void;
}

export default class AccountWithTotalItem extends React.Component<StateProps & DispatchProps, {}>{

    private process() {
        if (this.props.isCollapsed) this.props.decollapse();
        else this.props.collapse();
    }

    private renderCollapseIcon() {
        if (this.props.isParent && !this.props.isCustom) {
            if (this.props.isCollapsed)
                return <Add className={"collapse-expand "} onClick={this.props.decollapse} />
            else {
                return <Remove className={"collapse-expand "} onClick={this.props.collapse} />
            }
        }
        return <div className={'collapse-expand-empty'} />;
    }

    render() {
        if (!this.props.isVisible) return null;

        var accountItemTypeClass = this.props.isParent ? "parent" : "leaf";
        var isInactiveClass = this.props.isInActive ? 'inactive' : '';
        var negative = this.props.total < 0 ? ' negative' : '';

        let total = this.props.isNominated ? null : Math.round(this.props.total).toLocaleString();

        return <div className={"flex-center-alignment"}>
            <div className={"account " + accountItemTypeClass}>
                <div className={"flex-center-alignment"}>
                    <div style={{ width: this.props.level * 7 }} />
                    {this.renderCollapseIcon()}
                </div>
                <div className={'line-amount-header ' + isInactiveClass} title={this.props.name}>{this.props.name}</div>
                {(this.props.isParent && this.props.isCollapsed) && <span className={'line-header-children-count'}>{this.props.childrenCount}</span>}
                <div className={'inactive-container'} title={"Account is inactive"}>{this.props.isInActive && <MoneyOff className={'inactive-sign'} />}</div>
                <div className={'inactive-container'} title={"Account is nominated"}>{this.props.isNominated && <Visibility className={'inactive-sign'} />}</div>
            </div>
            <div title={total} className={"total " + accountItemTypeClass + negative}>{(this.props.isParent && !this.props.isCollapsed && !this.props.isCustom) ? null : total}</div>
        </div>
    }
}
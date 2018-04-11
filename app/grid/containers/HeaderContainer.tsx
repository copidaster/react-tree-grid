import { Redo, Undo } from 'material-ui-icons';
import IconButton from 'material-ui/IconButton';
import { AppState } from 'state';
import * as React from 'react';
import * as reactRedux from 'react-redux';
import * as AmmountData from "../../../state/AmountData"

class StateProps {
    canRedo: boolean;
    canUndo: boolean;
}

class DispatchProps {
    undo: () => void;
    redo: () => void;
}

class Decorator extends React.Component<StateProps & DispatchProps, {}> {

    private listener: EventListener;

    constructor(porps) {
        super(porps);

        this.listener = ((event: any) => {
            if (event.keyCode == 90 && event.ctrlKey) {
                event.preventDefault();
                this.props.undo();
            }

            else if (event.keyCode == 85 && event.ctrlKey) {
                this.props.redo();
                event.preventDefault();
            }
        });
    }

    componentDidMount() {
        document.addEventListener('keydown', this.listener);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.listener);
    }

    private undo() {
        if (this.props.canUndo) this.props.undo();
    }

    private redo() {
        if (this.props.canRedo) this.props.redo();
    }

    render() {

        var stylesDisabled = {
            pointerEvents: 'none'
        }

        var iconColorUndo = this.props.canUndo ? 'black' : 'grey';
        var iconColorRedo = this.props.canRedo ? 'black' : 'grey';

        return <div className={"flex-center-alignment"} style={{ height: 60, alignItems: 'center', display: 'flex' }}>
            <div style={{ fontFamily: 'Lato-Bold', paddingLeft: 15 }}>Powerfull grid</div>
            <div style={{ display: 'flex', marginLeft: 'auto', height: '100%', paddingLeft: 15, paddingRight: 15, alignItems: 'center' }}>
                <IconButton onClick={() => { this.undo() }} >
                    <Undo color={iconColorUndo} />
                </IconButton>
                <IconButton onClick={() => { this.redo() }}  >
                    <Redo color={iconColorRedo} />
                </IconButton>
            </div>
        </div>
    }
}

const mapStateToProps = (state: AppState, ownProps): StateProps => {
    if (state.amountData.computedTreeList == null || state.amountData.lines == null ) {

        return { canRedo: false, canUndo: false }
    }

    return { canRedo: AmmountData.Service.Manager.canRedo(), canUndo: AmmountData.Service.Manager.canUndo() };
}

const mapDispatchToProps = (dispatch, owmProps): DispatchProps => {
    return {
        undo: () => {
            AmmountData.Service.undo();
        },
        redo: () => {
            AmmountData.Service.redo();
        },
    }
}


export default reactRedux.connect(mapStateToProps, mapDispatchToProps)(Decorator);

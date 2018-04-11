export interface IUndoRedoAction {
    execute: () => void;
    unExecute: () => void;
}

export class CommandManager {

    private executed: Array<IUndoRedoAction>;
    private unexecuted: Array<IUndoRedoAction>;

    constructor() {
        this.executed = [];
        this.unexecuted = [];
    }

    public execute(action: IUndoRedoAction) {
        action.execute();
        this.executed.push(action);
    }

    public undo() {
        var cmd1 = this.executed.pop();
        if (cmd1 !== undefined) {
            if (cmd1.unExecute !== undefined) {
                cmd1.unExecute();
            }
            this.unexecuted.push(cmd1);
        }
    }

    public redo() {
        var cmd2 = this.unexecuted.pop();

        if (cmd2 === undefined) {
            cmd2 = this.executed.pop();
            this.executed.push(cmd2);
            this.executed.push(cmd2);
        }

        if (cmd2 !== undefined) {
            cmd2.execute();
            this.executed.push(cmd2);
        }
    }

    public canUndo() {
        return true;
    }

    public canRedo() {
        return true;
    }
}

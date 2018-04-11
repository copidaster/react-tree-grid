// ActionDeclaration class provides declaration of typed contract to for state mutation.

export default class ActionDeclaration<Command = {}>{

    public name: string;

    constructor(name: string) {
        this.name = name;
    }

    public toAction(Command: Command = null) {
        return {
            type: this.name,
            payload: Command
        };
    }

    public fromAction(action: any) {
        return action.payload as Command;
    }
}

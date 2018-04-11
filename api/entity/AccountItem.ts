export default class AccountItem {
    public Id: string;
    public ParentId: string;
    public LocalId: string
    public AccountType: string;
    public IsInactive: boolean;
    public Name: string;
    public Number: string;
    public ChildrenLeavesIds: Array<{ Id: string, LocalId: string }>;
    public ChildrenParentsIds: Array<string>;
}
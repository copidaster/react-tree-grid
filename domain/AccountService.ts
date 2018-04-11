import AccountItem from "./AccountItem"

export class AccountService {

    public getTree(workspaceId: string, organisationId: string, callback: (array: AccountTreeResponse) => void) {
        callback(null);
    }

    public getTreeAsync(): AccountTreeResponse {
        return {
            InactiveLeavesIds: [],
            NominatedLeavesIds: [],
            Leaves: [
                {
                    Id: '1',
                    LocalId: '1',
                    ParentId: "40cf51f8-2be2-4b8b-aa6d-a726195967e4",
                    AccountType: 'Asset',
                    Name: 'test',
                    Number: 'test',
                    IsInactive: false,
                    ChildrenLeavesIds: [],
                    ChildrenParentsIds: []
                },
                {
                    Id: '2',
                    LocalId: '2',
                    ParentId: "40cf51f8-2be2-4b8b-aa6d-a726195967e4",
                    AccountType: 'Asset',
                    Name: 'test2',
                    Number: 'test',
                    IsInactive: false,
                    ChildrenLeavesIds: [],
                    ChildrenParentsIds: []
                },
                {
                    Id: '3',
                    LocalId: '3',
                    ParentId: "40cf51f8-2be2-4b8b-aa6d-a726195967e4",
                    AccountType: 'Asset',
                    Name: 'test3',
                    Number: 'test',
                    IsInactive: false,
                    ChildrenLeavesIds: [],
                    ChildrenParentsIds: []
                },
                {
                    Id: '4',
                    LocalId: '4',
                    ParentId: "40cf51f8-2be2-4b8b-aa6d-a726195967e4",
                    AccountType: 'Asset',
                    Name: 'test4',
                    Number: 'test',
                    IsInactive: false,
                    ChildrenLeavesIds: [],
                    ChildrenParentsIds: []
                },
                {
                    Id: '5',
                    LocalId: '5',
                    ParentId: "40cf51f8-2be2-4b8b-aa6d-a726195967e4",
                    AccountType: 'Asset',
                    Name: 'test5',
                    Number: 'test',
                    IsInactive: false,
                    ChildrenLeavesIds: [],
                    ChildrenParentsIds: []
                }
            ],
            Parents: [{
                Id: "40cf51f8-2be2-4b8b-aa6d-a726195967e4",
                LocalId: null,
                ParentId: null,
                AccountType: 'Asset',
                Name: 'Asset',
                Number: '',
                IsInactive: false,
                ChildrenLeavesIds: [
                    { Id: '1', LocalId: '1' },
                    { Id: '2', LocalId: '2' }, { Id: '3', LocalId: '3' }, { Id: '4', LocalId: '4' }, { Id: '5', LocalId: '5' }
                ],
                ChildrenParentsIds: []
            }]
        }
    }
}

export class AccountTreeResponse {
    public InactiveLeavesIds: Array<string>;
    public NominatedLeavesIds: Array<string>;
    public Leaves: Array<AccountItem>;
    public Parents: Array<AccountItem>;
}


import * as lodash from 'lodash';

import ActionDeclaration from './ActionDeclaration';
import { AppState } from '../state';
import BudgetService from "../api/BudgetSource"
import { debounce, throttle } from 'lodash';
import { AccountService, AccountTreeResponse } from '../api/AccountSource';
import AmountLine from "../api/entity/AmountLine"
import AmountCell from '../api/entity/AmountCell';
import { CommandManager, IUndoRedoAction } from "../api/utils/CommandManager"
import AccountUtils from "../api/utils/AccountUtils"

class Actions {

    private static prefix: string = "BUDGET_EDIT_AMOUNT_DATA/";
    public static SetIsLoading = new ActionDeclaration<{ isLoading: boolean }>(Actions.prefix + "SET_IS_LOADING");
    public static SetSaveKey = new ActionDeclaration<{ saveKey: string }>(Actions.prefix + "SET_SAVE_KEY");
    public static SetOriginalTree = new ActionDeclaration<{ flat: Array<TreeItem> }>(Actions.prefix + "SET_ORIGINAL_FLAT_TREE");
    public static SetComputedTree = new ActionDeclaration<{ flat: Array<TreeItem> }>(Actions.prefix + "SET_COMPUTED_FLAT_TREE");
    public static SetLines = new ActionDeclaration<{ lines: Array<LineWithTotal> }>(Actions.prefix + "SET_LINES");
    public static Dispose = new ActionDeclaration(Actions.prefix + "DISPOSE");

    public static SetTreeAmount = new ActionDeclaration<{ tree: Array<TreeItem>, amountData: Array<LineWithTotal> }>(Actions.prefix + "SET_TREE_AMOUNT");
}

class TreeItem {
    id: string;
    parentId: string;
    level: number;
    name: string;
    isInactive: boolean;
    isNominated: boolean;
    isParent: boolean;
    isVisible: boolean;
    isCollapsed: boolean;
    childrenLeaves: Array<string>;
    childrenParents: Array<string>;
    custom?: boolean;
}

class LineWithTotal {
    id: string;
    isParent: boolean;
    line: Array<AmountCell>;
    total: number;
    custom?: boolean;
}

class AmountDataState {
    originalTreeList: Array<TreeItem>;
    computedTreeList: Array<TreeItem>;
    lines: Array<LineWithTotal>;
    isLoading: boolean;
}

const defaultState: AmountDataState = {
    originalTreeList: null,
    computedTreeList: null,
    isLoading: false,
    lines: null
}

function reduce(state: AmountDataState = defaultState, action: any): AmountDataState {
    switch (action.type) {

        case Actions.SetIsLoading.name:
            return lodash.assign({}, state, { isLoading: Actions.SetIsLoading.fromAction(action).isLoading });

        case Actions.SetOriginalTree.name:
            return lodash.assign({}, state, { originalTreeList: Actions.SetOriginalTree.fromAction(action).flat });

        case Actions.SetComputedTree.name:
            return lodash.assign({}, state, { computedTreeList: Actions.SetComputedTree.fromAction(action).flat });

        case Actions.SetLines.name:
            return lodash.assign({}, state, { lines: Actions.SetLines.fromAction(action).lines });

        case Actions.SetTreeAmount.name:
            return lodash.assign({}, state, { lines: Actions.SetTreeAmount.fromAction(action).amountData, computedTreeList: Actions.SetTreeAmount.fromAction(action).tree });

        case Actions.Dispose.name:
            return defaultState;

        default: return state;
    }
}

let throttledMove = throttle((dispatch, getState, moveDirection, lineId, period) => {
    let state = getState() as AppState;
    var ranges = state.amountData.lines[0].line.map(item => item.Period);
    var lines = state.amountData.computedTreeList.filter(item => !item.isParent && item.isVisible && !item.isNominated).map(item => item.id);

    var nextLineId = lineId;
    var nextPeriod = period;

    var indexOfPeriod = ranges.indexOf(period);
    var stepPeriod = 0;
    if (moveDirection == 37) {
        stepPeriod = -1;
    }
    else if (moveDirection == 39) {
        stepPeriod = 1;
    }

    if (stepPeriod != 0) {
        var newIndex = indexOfPeriod += stepPeriod;
        var potentialNewPeriod = ranges[newIndex];
        if (potentialNewPeriod !== undefined) {
            nextPeriod = potentialNewPeriod;
        }
    }

    var stepLine = 0;
    var indexOfLine = lines.indexOf(lineId);

    if (moveDirection == 38) {
        stepLine = -1;
    }
    else if (moveDirection == 40) {
        stepLine = 1;
    }

    if (stepLine != 0) {
        var newIndex = indexOfLine += stepLine;
        var potentialNewLine = lines[newIndex];
        if (potentialNewLine !== undefined) {
            nextLineId = potentialNewLine;
        }
    }

    var clickKey = "line-" + nextLineId + " period-" + nextPeriod.toString();
    var element = document.getElementById(clickKey);
    if (element != null) element.click();

    if (stepPeriod != 0) {
        var scrollSync = document.getElementById('scroll-budgets-vert');
        var toSync = document.getElementById('main-horiz');
        toSync.scrollTo(scrollSync.scrollLeft, scrollSync.scrollTop);
    }

}, 80);


let batchCache = new Array<{ LineLocalId: string, Period: any, Amount: number }>();
let throtledSave = throttle(async (key) => {
    if (batchCache.length > 0) {
        var copy = [...batchCache];
        batchCache = [];
        //saving
    }
}, 500);

class Service {

    public static Manager: CommandManager = new CommandManager();

    public static collapse(id: string) {
        return (dispatch, getState) => {
            var state = getState() as AppState;

            var lines = state.amountData.computedTreeList;
            var toHide = this.getAllLeavesAndParentsToBottom(state.amountData.computedTreeList, id);
            var newLines = lines.map(item => {
                if (item.id == id) {
                    return { ...item, isCollapsed: true };
                }
                else if (toHide.indexOf(item.id) !== -1) {
                    return { ...item, isVisible: false };
                }
                else {
                    return item;
                }
            });

            dispatch(Actions.SetComputedTree.toAction({ flat: newLines }));
        }
    }

    public static decolapse(id: string) {
        return (dispatch, getState) => {
            var state = getState() as AppState;

            var lines = state.amountData.computedTreeList;
            var parent = state.amountData.computedTreeList.find(item => item.id == id);
            var parentsOnLevelBottom = parent.childrenParents;
            var leavesOneLevelVottom = parent.childrenLeaves;

            var newLines = lines.map(item => {
                if (item.id == id) {
                    return { ...item, isCollapsed: false };
                }
                else if (leavesOneLevelVottom.indexOf(item.id) !== -1) {
                    return { ...item, isVisible: true, isCollapsed: false };
                }
                else if (parentsOnLevelBottom.indexOf(item.id) !== -1) {
                    return { ...item, isVisible: true, isCollapsed: true };
                }
                else {
                    return item;
                }
            });

            dispatch(Actions.SetComputedTree.toAction({ flat: newLines }));
        }
    }

    private static getAllLeavesAndParentsToBottom(treeList: Array<TreeItem>, parentId: string) {
        var allTreeItems = treeList.filter(item => item.parentId == parentId);
        var list = [...allTreeItems.map(item => item.id)];

        for (var parent of allTreeItems.filter(item => item.isParent)) {
            for (var item of this.getAllLeavesAndParentsToBottom(treeList, parent.id)) {
                list.push(item);
            }
        }

        return list;
    }


    public static loadByCurrentCriteria() {

        return async (dispatch, getState) => {

            var state = getState() as AppState;

            dispatch(Actions.SetIsLoading.toAction({ isLoading: true }));
            dispatch(Actions.SetSaveKey.toAction({ saveKey: null }));
            dispatch(Actions.SetLines.toAction({ lines: null }));

            var amountsData = new BudgetService().getAmountsByBusinessUnitProection();

            if (state.amountData.originalTreeList == null) {
                var tree = new AccountService().getTreeAsync();
                var mappedFlatTreeList = this.mapAccountTreeToFlatSpecificList(tree);
                var lines = new Array<LineWithTotal>();

                for (var lineAmount of amountsData.AmountLines) {
                    lines.push({ id: lineAmount.LineId, line: lineAmount.AmountCells, total: lineAmount.AmountCells.map(item => item.Amount).reduce((a, b) => { return a + b }, 0), isParent: false })
                }

                dispatch(Actions.SetOriginalTree.toAction({ flat: mappedFlatTreeList }));

                var linesCalculated = this.calculateAllLines(mappedFlatTreeList, lines);
                var swepTree = this.sweepTree(linesCalculated, mappedFlatTreeList);

                dispatch(Actions.SetTreeAmount.toAction({ tree: swepTree.tree, amountData: swepTree.lines }));
            }
            else {
                var lines = new Array<LineWithTotal>();
                for (var lineAmount of amountsData.AmountLines) {
                    lines.push({ id: lineAmount.LineId, line: lineAmount.AmountCells, isParent: false, total: lineAmount.AmountCells.map(item => item.Amount).reduce((a, b) => { return a + b }, 0) })
                }

                var linesCalculated = this.calculateAllLines(state.amountData.originalTreeList, lines);
                var swepTree = this.sweepTree(linesCalculated, state.amountData.originalTreeList);

                dispatch(Actions.SetTreeAmount.toAction({ tree: swepTree.tree, amountData: swepTree.lines }));

            }

            this.Manager = new CommandManager();
            dispatch(Actions.SetIsLoading.toAction({ isLoading: false }));
        }
    }


    private static sweepTree(lines: Array<LineWithTotal>, tree: Array<TreeItem>) {

        var inactiveItems = tree.filter(item => item.isInactive).map(item => item.id);
        var inactiveAndEmptyItems = lines.filter(item => item.total == 0 && inactiveItems.indexOf(item.id) !== -1);
        var idsToRemove = [];

        for (var itemWithInactiveTotal of inactiveAndEmptyItems) {

            var treeItem = tree.find(item => item.id == itemWithInactiveTotal.id);
            idsToRemove.push(itemWithInactiveTotal.id);

            let topSweep = (parentId: string) => {
                var parent = tree.find(item => item.id == parentId);
                var inactiveChildren = parent.childrenLeaves.filter(item => idsToRemove.indexOf(item) !== -1);
                if (inactiveChildren.length == parent.childrenLeaves.length) {
                    idsToRemove.push(parentId);
                    if (parent.parentId != null)
                        topSweep(parent.parentId);
                }
            }

            var parentId = treeItem.parentId;
            topSweep(parentId);
        }

        var newLines = [...lines.filter(item => idsToRemove.indexOf(item.id) === -1)];
        var newTree = [...tree.filter(item => idsToRemove.indexOf(item.id) === -1)];

        return { tree: newTree, lines: newLines };
    }

    public static moveToCellThrottled(lineId: string, period: number, moveDirection: number) {
        return (dispatch, getState) => {
            throttledMove(dispatch, getState, moveDirection, lineId, period);
        }
    }

    public static moveToCell(lineId: string, period: number, moveDirection: number) {
        return async (dispatch, getState) => {
            var state = getState() as AppState;

            var ranges = state.amountData.lines[0].line.map(item => item.Period);
            var lines = state.amountData.computedTreeList.filter(item => !item.isParent && item.isVisible).map(item => item.id);

            var nextLineId = lineId;
            var nextPeriod = period;

            var indexOfPeriod = ranges.indexOf(period);
            var stepPeriod = 0;
            if (moveDirection == 37) {
                stepPeriod = -1;
            }
            else if (moveDirection == 39) {
                stepPeriod = 1;
            }

            if (stepPeriod != 0) {
                var newIndex = indexOfPeriod += stepPeriod;
                var potentialNewPeriod = ranges[newIndex];
                if (potentialNewPeriod !== undefined) {
                    nextPeriod = potentialNewPeriod;
                }
            }

            var stepLine = 0;
            var indexOfLine = lines.indexOf(lineId);

            if (moveDirection == 38) {
                stepLine = -1;
            }
            else if (moveDirection == 40) {
                stepLine = 1;
            }

            if (stepLine != 0) {
                var newIndex = indexOfLine += stepLine;
                var potentialNewLine = lines[newIndex];
                if (potentialNewLine !== undefined) {
                    nextLineId = potentialNewLine;
                }
            }


            var clickKey = "line-" + nextLineId + " period-" + nextPeriod.toString();
            var element = document.getElementById(clickKey);
            if (element != null) element.click();
            else {
                //    console.error('failed id ' + clickKey);
            }
        }
    }

    public static undo() {
        this.Manager.undo();
    }

    public static redo() {
        this.Manager.redo();
    }

    public static saveAmounts(lineId: string, period: any, amount: number) {
        return async (dispatch, getState) => {

            var state = getState() as AppState;

            var line = state.amountData.lines.find(item => item.id == lineId);
            var oldAmmount = line.line.find(item => item.Period == period).Amount;

            if (amount != oldAmmount) {
                this.Manager.execute({
                    execute: () => {
                        dispatch(this.saveAmountCore(lineId, period, amount));

                    },
                    unExecute: () => {
                        dispatch(this.saveAmountCore(lineId, period, oldAmmount));
                    }
                })
            }
        }
    }

    private static saveAmountCore(lineId: string, period: any, amount: number) {
        return async (dispatch, getState) => {
            var state = getState() as AppState;

            var lines = state.amountData.lines;

            var newLines = lines.filter(item => !item.isParent).map(item => {
                if (item.id != lineId) return item;
                else {
                    var dd = item;

                    var lines = item.line.map(itemIn => {
                        if (itemIn.Period == period) {
                            return { ...itemIn, Amount: amount };
                        }
                        else return itemIn;
                    });

                    return {
                        ...item,
                        line: lines,
                        total: lines.map(item => item.Amount).reduce((a, b) => { return a + b }, 0)
                    }
                }
            })

            var currentState = state.amountData;

            var calculatedTotals = this.calculateAllLines(currentState.computedTreeList, newLines)
            var swepTree = this.sweepTree(calculatedTotals, state.amountData.computedTreeList);

            dispatch(Actions.SetTreeAmount.toAction({ tree: swepTree.tree, amountData: swepTree.lines }));
            batchCache.push({ LineLocalId: lineId, Period: period, Amount: amount });
        }
    }

    private static mapAccountTreeToFlatSpecificList(tree: AccountTreeResponse) {

        var flatAccountList = new Array<TreeItem>();
        var orderedTopAccounts = AccountUtils.getSortedToParentsCombinedWithCustom(tree);

        for (let account of orderedTopAccounts) {
            flatAccountList.push({
                id: account.Id,
                level: 0,
                parentId: null,
                isParent: true,
                isInactive: false,
                isNominated: false,
                name: account.Number.length == 0 ? account.Name : account.Number + " - " + account.Name,
                isVisible: true,
                isCollapsed: false,
                childrenLeaves: account.ChildrenLeavesIds.map(item => item.LocalId.toString()),
                childrenParents: account.ChildrenParentsIds,
                custom: account.AccountType == 'Custom'
            });

            this.grabToBottom(account.Id, tree, flatAccountList, 1);
        }

        return flatAccountList;
    }

    private static grabToBottom(idParent: string, tree: AccountTreeResponse, array: Array<TreeItem>, currentLevel: number) {
        var topTreeParents = tree.Parents.filter(item => item.ParentId == idParent);
        var topTreeLeaves = tree.Leaves.filter(item => item.ParentId == idParent);

        var currentAccounts = [...topTreeLeaves, ...topTreeParents].sort((item, item2) => { return (item.Number + "" + item.Name).localeCompare(item2.Number + "" + item2.Name) });

        let processParent = (account) => {
            array.push({
                id: account.Id,
                parentId: idParent,
                isInactive: false,
                level: currentLevel + 1,
                isParent: true,
                name: account.Number + "-" + account.Name,
                isVisible: true,
                isCollapsed: false,
                isNominated: false,
                childrenLeaves: account.ChildrenLeavesIds.map(item => item.LocalId.toString()),
                childrenParents: account.ChildrenParentsIds,
                custom: account.AccountType == 'Custom'
            });
            this.grabToBottom(account.Id, tree, array, currentLevel + 1);
        }

        let proccessLeaf = (account) => {
            array.push({
                id: account.LocalId,
                parentId: idParent,
                isInactive: account.IsInactive,
                level: currentLevel + 1,
                isParent: false,
                name: account.Number.length == 0 ? account.Name : account.Number + " - " + account.Name,
                isVisible: true,
                isCollapsed: false,
                isNominated: tree.NominatedLeavesIds.indexOf(account.Id) !== -1,
                childrenLeaves: account.ChildrenLeavesIds.map(item => item.LocalId.toString()),
                childrenParents: account.ChildrenParentsIds
            });
        }

        for (var item of currentAccounts) {
            if (item.ChildrenLeavesIds.length + item.ChildrenParentsIds.length > 0) processParent(item);
            else proccessLeaf(item);
        }
    }

    private static calculateCustomTotal(customParent: TreeItem, lines: Array<LineWithTotal>, tree: Array<TreeItem>) {

        var minusOperationPair = AccountUtils.getCustomTotalCalculationPair(customParent.id);
        if (minusOperationPair != undefined) {

            var sourceId = tree.filter(item => item.parentId == null).find(item => item.name.indexOf(minusOperationPair.source) !== -1);
            var destinationId = tree.filter(item => item.parentId == null).find(item => item.name.indexOf(minusOperationPair.destination) !== -1);

            if (sourceId == null || destinationId == null) return undefined;

            var sourceLines = lines.find(item => item.id == sourceId.id);
            var destinationLines = lines.find(item => item.id == destinationId.id);

            if (sourceLines == null || destinationLines == null) return undefined;

            var newLine = new Array<AmountCell>();
            for (var index = 0; index < sourceLines.line.length; index++) {
                var cell: AmountCell = {
                    Period: sourceLines.line[index].Period,
                    Notes: null,
                    Amount: sourceLines.line[index].Amount - destinationLines.line[index].Amount
                }

                newLine.push(cell);
            }
            return newLine;
        }
        else {
            throw Error('Undefined custom total. Please check it: ' + customParent.id);
        }
    }

    private static calculateAllLines(flatTree: Array<TreeItem>, linesSource: Array<LineWithTotal>) {

        var lines = new Array<LineWithTotal>();
        var parents = flatTree.filter(item => item.isParent);

        var maxLevel = flatTree.map(item => item.level).sort().reverse()[0];
        for (var i = maxLevel; i > -1; i--) {
            var currentLevelParents = parents.filter(item => item.level == i);
            for (var parent of currentLevelParents) {

                var amountLine = undefined;
                if (parent.custom) {
                    amountLine = this.calculateCustomTotal(parent, lines, flatTree);
                    if (amountLine == undefined) continue;
                }
                else {
                    amountLine = this.calculateLine(parent, flatTree, linesSource, lines);
                }
                let total = amountLine.map(item => item.Amount).reduce((a, b) => { return a + b }, 0);
                var linetoPushParent = { id: parent.id, line: amountLine, isParent: true, total: total };
                lines.push(linetoPushParent);
            }
        }

        return [...lines, ...linesSource];
    }

    private static calculateLine(parent: TreeItem, flatTree: Array<TreeItem>, linesSource: Array<LineWithTotal>, chache: Array<LineWithTotal>) {

        var array: Array<AmountCell> = linesSource[0].line.map((item) => {
            var itemInner: AmountCell = {
                Period: item.Period, Notes: null, Amount: 0
            };
            return itemInner
        });

        for (var leaf of parent.childrenLeaves) {
            var line = linesSource.find(item => item.id == leaf);

            if (line != null) {
                line.line.forEach((item, index) => {
                    array[index].Amount += item.Amount;
                });
            }
        }

        for (var parentItem of parent.childrenParents) {
            var fromCache = chache.find(item => item.id == parentItem);

            if (fromCache != null) {
                fromCache.line.forEach((item, index) => {
                    array[index].Amount += item.Amount;
                });
            }
        }

        return array;
    }

    public static dispose() {
        return (dispatch, getState) => {
            dispatch(Actions.Dispose.toAction());
        }
    }
}

const name = "amountData";

export {
    reduce as Reducer,
    defaultState as DefaultState,
    AmountDataState as State,
    Service as Service,
    name as name
};



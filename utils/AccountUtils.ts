import AccountItem from '../domain/AccountItem';

import * as lodash from "lodash"

export class AccountTypeRegistry {
    public static Income = 'Income';
    public static CostOfSales = 'Cost of Sales';
    public static Expense = 'Expense';
    public static OtherExpense = 'Other Expense';
    public static OtherIncome = 'Other Income';
    public static Asset = 'Asset';
    public static Liability = 'Liability';
    public static Equity = 'Equity';
}

export default class AccountUtils {

    public static GrossProfit: AccountItem = {
        Id: 'gross-profit',
        LocalId: 'gross-profit',
        ParentId: null,
        AccountType: 'Custom',
        Name: 'Gross Profit',
        Number: '',
        IsInactive: false,
        ChildrenLeavesIds: [],
        ChildrenParentsIds: []
    };

    public static OperatingProfit: AccountItem = {
        Id: 'operating-profit',
        LocalId: 'operating-profit',
        ParentId: null,
        AccountType: 'Custom',
        IsInactive: false,
        Name: 'Operating Profit',
        Number: '',
        ChildrenLeavesIds: [],
        ChildrenParentsIds: []
    };

    public static NetAssets: AccountItem = {
        Id: 'net-assets',
        LocalId: 'net-assets',
        IsInactive: false,
        ParentId: null,
        AccountType: 'Custom',
        Name: 'Net Assets',
        Number: '',
        ChildrenLeavesIds: [],
        ChildrenParentsIds: []
    };

    private static createDublicatedAsTotal(accountItem: AccountItem) {
        return {
            Id: accountItem.Id + "%customcalculation",
            LocalId: accountItem.LocalId + "%customcalculation",
            ParentId: accountItem.Id,
            AccountType: 'Custom',
            Name: 'Total ' + accountItem.Name,
            Number: '',
            IsInactive: false,
            ChildrenLeavesIds: [],
            ChildrenParentsIds: [],
        };
    }

    public static getSortedToParentsCombinedWithCustom(tree: any) {

        var topAccounts = tree.Parents.filter(item => item.ParentId == null);

        var income = topAccounts.find(item => item.AccountType == AccountTypeRegistry.Income);
        var costOfSales = topAccounts.find(item => item.AccountType == AccountTypeRegistry.CostOfSales);
        var expenses = topAccounts.find(item => item.AccountType == AccountTypeRegistry.Expense);
        var otherExpenses = topAccounts.find(item => item.AccountType == AccountTypeRegistry.OtherExpense);
        var otherIncome = topAccounts.find(item => item.AccountType == AccountTypeRegistry.OtherIncome);
        var asset = topAccounts.find(item => item.AccountType == AccountTypeRegistry.Asset);
        var liability = topAccounts.find(item => item.AccountType == AccountTypeRegistry.Liability);
        var equity = topAccounts.find(item => item.AccountType == AccountTypeRegistry.Equity);

        let grossProfit = income != null && costOfSales != null? this.GrossProfit : undefined;
        let netAssets =  asset != null && liability != null? this.NetAssets : undefined;
        let operatingProfit =  grossProfit != null && expenses != null? this.OperatingProfit : undefined;
        
        var accountTopArray = [
            income,
            costOfSales,
            grossProfit,
            expenses,
            operatingProfit,
            otherIncome,
            otherExpenses,
            asset,
            liability,
            netAssets,
            equity
        ].filter(item => item !== undefined);

        return accountTopArray;
    }

    public static getCustomTotalCalculationPair(id: string): { source: string, destination: string } {
        if (id == this.GrossProfit.Id) return { source: AccountTypeRegistry.Income, destination: AccountTypeRegistry.CostOfSales };
        else if (id == this.OperatingProfit.Id) return { source: this.GrossProfit.Name, destination: AccountTypeRegistry.Expense };
        else if (id == this.NetAssets.Id) return { source: AccountTypeRegistry.Asset, destination: AccountTypeRegistry.Liability };
        else return undefined;
    }
}
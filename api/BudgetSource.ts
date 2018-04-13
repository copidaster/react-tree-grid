import AmountLine from "./entity/AmountLine"

export default class BudgetService {

    public getAmountsByBusinessUnitProection(): Response {

        let zeroAmounts = [
            { Period: 201601, Amount: 0, Notes: null },
            { Period: 201602, Amount: 0, Notes: null },
            { Period: 201603, Amount: 0, Notes: null },
            { Period: 201604, Amount: 0, Notes: null },
            { Period: 201605, Amount: 0, Notes: null },
            { Period: 201606, Amount: 0, Notes: null },
            { Period: 201607, Amount: 0, Notes: null },
            { Period: 201608, Amount: 0, Notes: null },
            { Period: 201609, Amount: 0, Notes: null },
            { Period: 2016010, Amount: 0, Notes: null },
            { Period: 2016011, Amount: 0, Notes: null },
            { Period: 2016012, Amount: 0, Notes: null },
            { Period: 201701, Amount: 0, Notes: null },
            { Period: 201702, Amount: 0, Notes: null },
            { Period: 201703, Amount: 0, Notes: null },
            { Period: 201704, Amount: 0, Notes: null },
            { Period: 201705, Amount: 0, Notes: null },
            { Period: 201706, Amount: 0, Notes: null },
            { Period: 201707, Amount: 0, Notes: null },
            { Period: 201708, Amount: 0, Notes: null },
            { Period: 201709, Amount: 0, Notes: null },
            { Period: 2017010, Amount: 0, Notes: null },
            { Period: 2017011, Amount: 0, Notes: null },
            { Period: 2017012, Amount: 0, Notes: null },
        ];

        return {
            AmountLines: [
                {
                    LineId: '1', AmountCells: zeroAmounts
                },
                {
                    LineId: '2', AmountCells: zeroAmounts
                },
                {
                    LineId: '3', AmountCells: zeroAmounts
                },
                {
                    LineId: '4', AmountCells: zeroAmounts
                },
                {
                    LineId: '5', AmountCells: zeroAmounts
                },
                {
                    LineId: '6', AmountCells: zeroAmounts
                },
                {
                    LineId: '7', AmountCells: zeroAmounts
                },
                {
                    LineId: '8', AmountCells: zeroAmounts
                },
                {
                    LineId: '9', AmountCells: zeroAmounts
                }
                ,
                {
                    LineId: '10', AmountCells: zeroAmounts
                }
                ,
                {
                    LineId: '11', AmountCells: zeroAmounts
                },
                {
                    LineId: '12', AmountCells: zeroAmounts
                },
                {
                    LineId: '13', AmountCells: zeroAmounts
                },
                {
                    LineId: '14', AmountCells: zeroAmounts
                },
                {
                    LineId: '15', AmountCells: zeroAmounts
                },
                {
                    LineId: '16', AmountCells: zeroAmounts
                },
                {
                    LineId: '17', AmountCells: zeroAmounts
                },
                {
                    LineId: '18', AmountCells: zeroAmounts
                }
            ]
        };
    }
}

export class Response {
    AmountLines: Array<AmountLine>;
}
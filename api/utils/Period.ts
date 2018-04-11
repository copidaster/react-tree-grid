
export default class Period {
    Year: number;
    Month: number;

    constructor(year: number, month: number) {
        this.Year = year;
        this.Month = month;
    }
    
    public static AddMonths = (period: Period, monthCount: number): Period => {
        let month = period.Month;
        let year = period.Year;

        let potentialMonthNumberZeroBased = (month - 1) + monthCount;
        if (potentialMonthNumberZeroBased >= 0)
        {
            month = (potentialMonthNumberZeroBased % 12) + 1;
            year += Math.trunc(potentialMonthNumberZeroBased / 12);
        }
        else
        {
            month = 12 + ((potentialMonthNumberZeroBased + 1) % 12);
            year += Math.trunc((potentialMonthNumberZeroBased - 12 + 1) / 12);
        }
        
        return new Period(year, month);
    }

    public static MonthDifference(period1: Period, period2: Period) : number {
        let yearsMonth1 = period1.Year * 12;
        let yearsMonth2 = period2.Year * 12;

        let month1 = yearsMonth1 + period1.Month;
        let month2 = yearsMonth2 + period2.Month;

        return month2 - month1;
    }
}
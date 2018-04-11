
import Period from "./Period"

export default function GetTitledMonths(): Array<{ id: number, title: string }> {
    const titleMonthes: Array<{ id: number, title: string }> = [];

    titleMonthes.push({ id: 1, title: "Jan" });
    titleMonthes.push({ id: 2, title: "Feb" });
    titleMonthes.push({ id: 3, title: "Mar" });
    titleMonthes.push({ id: 4, title: "Apr" });
    titleMonthes.push({ id: 5, title: "May" });
    titleMonthes.push({ id: 6, title: "Jun" });
    titleMonthes.push({ id: 7, title: "Jul" });
    titleMonthes.push({ id: 8, title: "Aug" });
    titleMonthes.push({ id: 9, title: "Sep" });
    titleMonthes.push({ id: 10, title: "Oct" });
    titleMonthes.push({ id: 11, title: "Nov" });
    titleMonthes.push({ id: 12, title: "Dec" });

    return titleMonthes;
}

export class Utility {

    public static FromDtoString(periodString: string): Period {
        if (periodString == null) return null;

        var periodYear = periodString.substring(0, 4);
        var periodMonth = periodString.substring(5);
        if (periodMonth[0] == '0') periodMonth = periodMonth.substring(0);

        return new Period(parseInt(periodYear), parseInt(periodMonth));
    }

    public static ToDtoString(period: Period): string {
        if (period == null) return null;
        return period.Year.toString() + "-" + period.Month.toString();
    }

    public static Now() {
        var date = new Date();
        return new Period(date.getFullYear(), date.getMonth() + 1);
    }

    public static ToUserFriendlyString(period: Period): string {
        var month = GetTitledMonths().filter(item => item.id == period.Month);
        if (month.length == 0) {
            throw Error('Can not find month');
        }

        return month[0].title + " " + period.Year.toString();
    }

    public static ApplyShiftReportPeriod(period: Period, shift: number): Period {
        return this.ApplyShiftCore(period, shift);
    }

    public static ApplyShiftFY(period: Period, reportinstantMonth: number, shift: number): Period {
        if (shift < 0) shift++;

        var adjusted = this.ApplyShiftCore(period, shift);

        if (reportinstantMonth <= period.Month) {
            adjusted.Year--;
        }

        return adjusted;
    }

    public static ApplyShiftCalendar(period: Period, shift: number): Period {
        if (shift > 0) shift--;
        return this.ApplyShiftCore(period, shift);
    }

    public static ApplyShiftCore(period: Period, shift: number) {
        var date = new Date(period.Year, period.Month - 1);
        var threeMonthsInTheFuture = new Date(new Date(date).setMonth((date.getMonth()) + shift));

        return new Period(threeMonthsInTheFuture.getFullYear(), threeMonthsInTheFuture.getMonth() + 1);
    }
}
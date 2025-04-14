import moment from "moment";


export default class DateUtils {

    /**
    * Generates date based on the input with format
    * @param format date format
    * @returns 
    */

    public static async generateDateWithFormat(format: string): Promise<string> {
        const date = moment().format(format);
        return date;
    }

    /**
    * Generates date based on the input
    * @param format date format
    * @param days increment OR decrement the days
    * @returns 
    */

    public static async IncreaseDateByDaysWithFormat(format: string, NoOfDays: number): Promise<string> {
        const date = moment().add(NoOfDays, 'd').format(format);
        return date;
    }

    /**
    * Generates date based on the input
    * @param format date format
    * @param months increment OR decrement the months
    * @returns 
    */

    public static async IncreaseDateByMonthsWithFormat(format: string, NoOfMonths: number): Promise<string> {
        const date = moment().add(NoOfMonths, 'M').format(format);
        return date;
    }

    /**
    * Generates date based on the input
    * @param format date format
    * @param NoOfYears increment OR decrement the years
    * @returns 
    */

    public static async IncreaseDateByYearsWithFormat(format: string, NoOfYears: number): Promise<string> {
        const date = moment().add(NoOfYears, 'y').format(format);
        return date;
    }

    /**
    * Generates date based on the input
    * @param format date format
    * @param days increment OR decrement the days
    * @param months increment OR decrement the months
    * @param years increment OR decrement the years
    * @returns 
    */

    public static dateGenerator(format: string, days: number, months: number, years: number): string {
        const date = moment().add(days, 'd').add(months, 'M').add(years, 'y').format(format);
        return date;
    }
}
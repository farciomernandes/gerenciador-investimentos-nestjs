import { differenceInMonths, differenceInYears } from 'date-fns';

export const INVESTMENT_RETURN_RATE = 0.0052; // 0,52%

export const TAX_RATES = {
  LESS_THAN_ONE_YEAR: 0.225, // 22,5%
  BETWEEN_ONE_AND_TWO_YEARS: 0.185, // 18,5%
  MORE_THAN_TWO_YEARS: 0.15, // 15%
};

export class InvestmentCalculations {
  public static calculateCurrentValue(
    currentValue: number,
    interestRate: number,
    months: number,
  ): number {
    return currentValue * (1 + interestRate) ** months;
  }

  public static getMonthsSinceCreation(createAt: Date): number {
    const today = new Date();
    return differenceInMonths(today, createAt);
  }

  public static getTaxRate(createAt: Date): number {
    const age = this.getAge(createAt);
    if (age < 1) {
      return TAX_RATES.LESS_THAN_ONE_YEAR;
    } else if (age < 2) {
      return TAX_RATES.BETWEEN_ONE_AND_TWO_YEARS;
    } else {
      return TAX_RATES.MORE_THAN_TWO_YEARS;
    }
  }

  public static getAge(createAt: Date): number {
    const today = new Date();
    return differenceInYears(today, createAt);
  }
}

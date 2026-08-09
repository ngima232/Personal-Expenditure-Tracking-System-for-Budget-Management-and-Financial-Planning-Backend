export enum TransactionTypeEnum {
    INCOME = "income",
    EXPENSE = "expense",
  }


 export enum PaymentMethodEnum {
    CASH = 'cash',
    CARD = 'card',
    BANK_TRANSFER = 'bank_transfer',
    MOBILE_WALLET = 'mobile_wallet',
    OTHER = 'other',
  }
  //cash,card,bank_transfer,mobile_wallet,other
 
export enum RecurrenceFrequencyEnum {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
  }

  export enum ForecastMethod {
  NO_FORECAST = "NO_FORECAST",
  WEIGHTED_MOVING_AVERAGE = "WEIGHTED_MOVING_AVERAGE",
  HOLT_LINEAR_TREND = "HOLT_LINEAR_TREND",
}
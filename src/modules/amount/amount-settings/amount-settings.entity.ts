export interface HourlyRateSettings {
  hourlyRate: number;
}

export interface MinBillableSettings {
  minDuration: number;
}

export interface AmountSettings extends HourlyRateSettings, MinBillableSettings { }

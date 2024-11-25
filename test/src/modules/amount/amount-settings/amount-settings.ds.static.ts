import { Inject, Injectable } from "@nestjs/common";
import { AmountSettingsDataSource } from "./amount-settings.ds";
import { AmountSettings } from "./amount-settings.entity";

export const DEFAULT_HOURLY_RATE = 'DEFAULT_HOURLY_RATE';
export const DEFAULT_MIN_BILLABLE = 'DEFAULT_MIN_BILLABLE';

@Injectable()
export class AmountSettingsStaticDataSource extends AmountSettingsDataSource {
  constructor(
    @Inject(DEFAULT_HOURLY_RATE) private hourlyRate: number,
    @Inject(DEFAULT_MIN_BILLABLE) private minBillable: number) {
    super();
  }

  async getAmountSettings(): Promise<AmountSettings> {
    return {
      hourlyRate: this.hourlyRate,
      minDuration: this.minBillable
    };
  }

}
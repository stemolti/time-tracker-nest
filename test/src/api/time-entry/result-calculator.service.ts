import { Injectable } from "@nestjs/common";
import { AmountService } from "./amount/amount.service";
import { FixedAmountService } from "./amount/fixed-amount.service";
import { DurationSettingsDataSource } from "@modules/duration/duration-settings";
import { TimeEntryResultFactory } from "./result.service";
import { AmountSettingsDataSource, AmountSettings } from "@modules/amount/amount-settings";
import { DurationStrategySelectorService, DurationService } from "@modules/duration/duration-strategy";
import { TimeEntry, TimeEntryResultDTO } from "@modules/time-entry";

@Injectable()
export class TimeEntryResultCalculatorService {

  constructor(
    private readonly durationSettingsSrv: DurationSettingsDataSource,
    private readonly durationStrategySelector: DurationStrategySelectorService,
    private readonly amountSettingSrv: AmountSettingsDataSource,
    private readonly resultFactoryProvider: TimeEntryResultFactory
   ) { }

  protected async getDurationService(userId: string): Promise<DurationService> {
    const durationSettings = await this.durationSettingsSrv.getDurationSettings(userId);
    return this.durationStrategySelector.getStrategy(durationSettings.strategy);
  }

  protected async getAmountService(record: TimeEntry, amountSettings: AmountSettings, durationSrv: DurationService): Promise<AmountService> {
    let amountSrv: AmountService;
    if (durationSrv.getMinutes(record.start, record.end) < amountSettings.minDuration) {
      amountSrv = new FixedAmountService(0);
    } else {
      amountSrv = new FixedAmountService(amountSettings.hourlyRate);
    }
    return amountSrv;
  }

  async calcResult(userId: string, record: TimeEntry[]): Promise<TimeEntryResultDTO[]>;
  async calcResult(userId: string, record: TimeEntry): Promise<TimeEntryResultDTO>;
  async calcResult(userId: string, record: TimeEntry | TimeEntry[]) {
    const isArray = Array.isArray(record);
    const items = isArray ? record : [record];

    const durationSrv = await this.getDurationService(userId);
    const amountSettings = await this.amountSettingSrv.getAmountSettings(userId);

    const results: TimeEntryResultDTO[] = [];
    for (const item of items) {
      const amountSrv = await this.getAmountService(item, amountSettings, durationSrv);
      
      const resultFactory = this.resultFactoryProvider.getFactory(durationSrv, amountSrv);
      results.push(resultFactory(item));
    }

    return isArray ? results : results[0];
  }
}
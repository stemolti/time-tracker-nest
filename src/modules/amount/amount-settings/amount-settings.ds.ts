import { AmountSettings } from "./amount-settings.entity";

export abstract class AmountSettingsDataSource {
  abstract getAmountSettings(userId: string): Promise<AmountSettings>;
}
import { DurationSettings } from "./duration-settings.entity";

export abstract class DurationSettingsDataSource {
  abstract getDurationSettings(userId: string): Promise<DurationSettings>;
}
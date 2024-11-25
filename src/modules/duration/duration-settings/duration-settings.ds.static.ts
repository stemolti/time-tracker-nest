import { DurationSettingsDataSource } from "./duration-settings.ds";
import { DurationSettings } from "./duration-settings.entity";

export class DurationSettingsStaticDataSource  extends DurationSettingsDataSource{
  async getDurationSettings(): Promise<DurationSettings> {
    return {
      strategy: 'exact'
    }
  }

}
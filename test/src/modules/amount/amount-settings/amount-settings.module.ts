import { DynamicModule, Module, Provider } from "@nestjs/common";
import { AmountSettingsDataSource } from "./amount-settings.ds";

@Module({})
export class AmountSettingsModule {
  static forRoot(providers: Provider[], global = true): DynamicModule {
    return {
      global,
      module: AmountSettingsModule,
      providers: [
        ...providers
      ],
      exports: [AmountSettingsDataSource]
    }
  }
}
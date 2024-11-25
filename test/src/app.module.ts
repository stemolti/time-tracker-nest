import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeEntryApiModule } from './api/time-entry/time-entry.module';
import { DurationSettingsModule, DurationSettingsDataSource, DurationSettingsStaticDataSource } from '@modules/duration/duration-settings';
import { DEFAULT_DURATION_ROUND_VALUE, DurationStrategyModule, DurationStrategySelectorService, ExactDurationService, RoundedDurationService } from '@modules/duration/duration-strategy';
import { AmountSettingsDataSource, AmountSettingsModule, AmountSettingsStaticDataSource, DEFAULT_HOURLY_RATE, DEFAULT_MIN_BILLABLE } from '@modules/amount/amount-settings';
import { TimeEntryDataSource, TimeEntryModule, TimeEntryMongoDataSource } from '@modules/time-entry';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/time-tracker-2024'),
    DurationSettingsModule.forRoot([{
      provide: DurationSettingsDataSource,
      useClass: DurationSettingsStaticDataSource
    }]),
    AmountSettingsModule.forRoot([
      {
        provide: AmountSettingsDataSource,
        useClass: AmountSettingsStaticDataSource
      },
      { provide: DEFAULT_HOURLY_RATE, useValue: 30 },
      { provide: DEFAULT_MIN_BILLABLE, useValue: 15 },
    ]),
    DurationStrategyModule,
    TimeEntryModule.forRoot([{
      provide: TimeEntryDataSource,
      useClass: TimeEntryMongoDataSource
    }]),
    TimeEntryApiModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ExactDurationService,
    {
      provide: DEFAULT_DURATION_ROUND_VALUE,
      useValue: 30
    },
    RoundedDurationService
  ],
})
export class AppModule {
  constructor(
    durationStrategySrv: DurationStrategySelectorService,
    exact: ExactDurationService,
    rounded: RoundedDurationService
  ) {
    durationStrategySrv.addStrategy('exact', exact);
    durationStrategySrv.addStrategy('rounded', rounded);
  }
}

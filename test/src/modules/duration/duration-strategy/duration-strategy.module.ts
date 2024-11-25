import { Module } from "@nestjs/common";
import { DurationStrategySelectorService } from "./duration-strategy-selector.service";

@Module({
  providers: [DurationStrategySelectorService],
  exports: [DurationStrategySelectorService]
})
export class DurationStrategyModule { }
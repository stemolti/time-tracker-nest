import { Inject, Injectable } from "@nestjs/common";
import { DurationService } from "./duration.service";

export const DEFAULT_DURATION_ROUND_VALUE = 'DEFAULT_DURATION_ROUND_VALUE';

@Injectable()
export class RoundedDurationService extends DurationService {
  constructor(@Inject(DEFAULT_DURATION_ROUND_VALUE) private roundValue: number) {
    super();
  }

  calcDuration(millis: number): number {
    const roundMillis = this.roundValue * 1000 * 60;
    return Math.round(millis / roundMillis) * roundMillis;
  }
}
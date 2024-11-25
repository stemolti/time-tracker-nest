import { Injectable } from "@nestjs/common";
import { DurationService } from "./duration.service";

@Injectable()
export class ExactDurationService extends DurationService {
  calcDuration(millis: number): number {
    return millis / (1000 * 60 * 60);
  }
}
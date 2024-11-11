import { Injectable } from "@nestjs/common";
import { DurationService } from "./duration/duration.service";
import { AmountService } from "./amount/amount.service";
import { TimeEntry } from "./time-entry.schema";
import { CalculatedTimeEntry } from "./time-entry.entity";

@Injectable()
export class TimeEntryResultFactory {

  getFactory(durationSrv: DurationService, amountSrv: AmountService) {
    return (timeEntry: TimeEntry): CalculatedTimeEntry => {
      const duration = durationSrv.getDuration(timeEntry.start, timeEntry.end);
      return {
        ...timeEntry,
        amount: timeEntry.billable ? amountSrv.calcAmount(duration) : 0,
      };  
    }
  }
}
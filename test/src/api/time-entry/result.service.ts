import { Injectable } from "@nestjs/common";
import { AmountService } from "./amount/amount.service";
import { DurationService } from "@modules/duration/duration-strategy";
import { TimeEntry, TimeEntryResultDTO } from "@modules/time-entry";

@Injectable()
export class TimeEntryResultFactory {

  getFactory(durationSrv: DurationService, amountSrv: AmountService) {
    return (timeEntry: TimeEntry): TimeEntryResultDTO => {
      const duration = durationSrv.getDuration(timeEntry.start, timeEntry.end);
      return {
        ...timeEntry,
        amount: timeEntry.billable ? amountSrv.calcAmount(duration) : 0,
      };  
    }
  }
}
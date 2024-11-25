import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsString } from "class-validator";
import { TimeEntry } from "./time-entry.schema";

export class CreateTimeEntryDTO {
  @IsString()
  description: string;

  @IsDate()
  @Type(() => Date)
  start: Date;

  @IsDate()
  @Type(() => Date)
  end: Date; 

  @IsBoolean()
  billable: boolean;
}

export class TimeEntryResultDTO extends TimeEntry {
  amount: number;
}
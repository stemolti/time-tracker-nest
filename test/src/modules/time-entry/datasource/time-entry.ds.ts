import { CreateTimeEntryDTO } from "../entity/time-entry.dto";
import { TimeEntry } from "../entity/time-entry.schema";
import { Types } from "mongoose";

export abstract class TimeEntryDataSource {
  abstract find(): Promise<TimeEntry[]>;

  abstract get(id: Types.ObjectId | string): Promise<TimeEntry>;

  abstract create(data: CreateTimeEntryDTO): Promise<TimeEntry>;
}
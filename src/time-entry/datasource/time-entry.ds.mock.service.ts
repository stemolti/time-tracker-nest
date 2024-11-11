import { Injectable, Optional } from "@nestjs/common";
import { TimeEntry } from "../time-entry.schema";
import { Types } from "mongoose";
import { CreateTimeEntryDTO } from "../time-entry.dto";
import { TimeEntryDataSource } from "./time-entry.ds";

@Injectable()
export class TimeEntryMockDataSource extends TimeEntryDataSource {
  constructor(@Optional() private data: TimeEntry[] = []) {
    super();
  }

  setRecords(data: TimeEntry[]) {
    this.data = data;
  }

  async find(): Promise<TimeEntry[]> {
    return this.data;
  }

  async get(id: Types.ObjectId | string): Promise<TimeEntry> {
    return this.data.find(e => e.id == id);
  }

  async create(data: CreateTimeEntryDTO): Promise<TimeEntry> {
    const id = new Types.ObjectId().toString();
    const record = {...data, id};
    this.data.push(record);
    return record;
  }
}
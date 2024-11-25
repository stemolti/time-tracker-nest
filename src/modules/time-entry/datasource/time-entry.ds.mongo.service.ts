import { Injectable } from "@nestjs/common";
import { CreateTimeEntryDTO } from "../entity/time-entry.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { TimeEntry } from "../entity/time-entry.schema";
import { TimeEntryDataSource } from "./time-entry.ds";

@Injectable()
export class TimeEntryMongoDataSource extends TimeEntryDataSource {
  constructor(
    @InjectModel(TimeEntry.name)
    private readonly timeEntryModel: Model<TimeEntry>) {
      super();
    }

  async find(): Promise<TimeEntry[]> {
    const list = await this.timeEntryModel.find()
    return list.map(r => r.toObject());
  }

  async get(id: Types.ObjectId | string): Promise<TimeEntry> {
    return this.timeEntryModel.findById(id)
      .then(record => record.toObject());
  }

  async create(data: CreateTimeEntryDTO): Promise<TimeEntry> {
    return this.timeEntryModel.create(data)
      .then(record => record.toObject());
  }
}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TimeEntryDocument = HydratedDocument<TimeEntry>;

@Schema({toObject: {virtuals: true}})
export class TimeEntry {
  id: string;

  @Prop()
  description: string;

  @Prop()
  start: Date;

  @Prop()
  end: Date;

  @Prop()
  billable: boolean;
}

export const TimeEntrySchema = SchemaFactory.createForClass(TimeEntry);

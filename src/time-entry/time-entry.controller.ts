import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TimeEntry } from './time-entry.schema';
import { CalculatedTimeEntry } from './time-entry.entity';
import { CreateTimeEntryDTO } from './time-entry.dto';
import { TimeEntryDataSource } from './datasource/time-entry.ds';

@Controller('time-entries')
export class TimeEntryController {
  constructor(
    private readonly timeEntryDs: TimeEntryDataSource
  ) {}

  @Get()
  async list(): Promise<CalculatedTimeEntry[]> {
    const list: TimeEntry[] = await this.timeEntryDs.find();

    return list.map((e) => {
      const duration = (e.end.getTime() - e.start.getTime()) / (1000 * 60 * 60);
      return {
        ...e,
        amount: e.billable ? duration * 60 : 0,
      };
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const record: TimeEntry = await this.timeEntryDs.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const duration = (record.end.getTime() - record.start.getTime()) / (1000 * 60 * 60);
    return {
      ...record,
      amount: record.billable ? duration * 60 : 0,
    };
  }

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createTimeEntryDTO: CreateTimeEntryDTO) {
    const record: TimeEntry = await this.timeEntryDs.create(createTimeEntryDTO);
  
    const duration = (record.end.getTime() - record.start.getTime()) / (1000 * 60 * 60);
    return {
      ...record,
      amount: record.billable ? duration * 60 : 0,
    };
  }
}

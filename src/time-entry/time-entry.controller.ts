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
import { DurationService } from './duration/duration.service';
import { AmountService } from './amount/amount.service';
import { TimeEntryResultFactory } from './result.service';

@Controller('time-entries')
export class TimeEntryController {
  constructor(
    private readonly timeEntryDs: TimeEntryDataSource,
    private readonly durationSrv: DurationService,
    private readonly amountSrv: AmountService,
    private readonly resultFactoryProvider: TimeEntryResultFactory
  ) {}

  @Get()
  async list(): Promise<CalculatedTimeEntry[]> {
    const list: TimeEntry[] = await this.timeEntryDs.find();

    const resultFactory = this.resultFactoryProvider.getFactory(this.durationSrv, this.amountSrv);
    return list.map((e) => {
      return resultFactory(e);
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const record: TimeEntry = await this.timeEntryDs.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    const resultFactory = this.resultFactoryProvider.getFactory(this.durationSrv, this.amountSrv);
    return resultFactory(record);
  }

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createTimeEntryDTO: CreateTimeEntryDTO) {
    const record: TimeEntry = await this.timeEntryDs.create(createTimeEntryDTO);
  
    const resultFactory = this.resultFactoryProvider.getFactory(this.durationSrv, this.amountSrv);
    return resultFactory(record);
  }
}

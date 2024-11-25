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
import { TimeEntryResultCalculatorService } from './result-calculator.service';
import { TimeEntryDataSource, CalculatedTimeEntry, TimeEntry, CreateTimeEntryDTO } from '@modules/time-entry';

const FAKE_USER = '1234';

@Controller('time-entries')
export class TimeEntryController {
  constructor(
    private readonly timeEntryDs: TimeEntryDataSource,
    private readonly resultCalculatorSrv: TimeEntryResultCalculatorService
  ) {}

  @Get()
  async list(): Promise<CalculatedTimeEntry[]> {
    const list: TimeEntry[] = await this.timeEntryDs.find();
    
    return this.resultCalculatorSrv.calcResult(FAKE_USER, list);
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const record: TimeEntry = await this.timeEntryDs.get(id);
    if (!record) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return this.resultCalculatorSrv.calcResult(FAKE_USER, record);
  }

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createTimeEntryDTO: CreateTimeEntryDTO) {
    const record: TimeEntry = await this.timeEntryDs.create(createTimeEntryDTO);

    return this.resultCalculatorSrv.calcResult(FAKE_USER, record);
  }
}

import { Test, TestingModule } from "@nestjs/testing";
import { TimeEntryController } from "./time-entry.controller";
import { TimeEntryDataSource } from "./datasource/time-entry.ds";
import { TimeEntryMockDataSource } from "./datasource/time-entry.ds.mock.service";
import { Types } from "mongoose";
import { TimeEntry } from "./time-entry.schema";
import { DurationService } from "./duration/duration.service";
import { ExactDurationService } from "./duration/exact-duration.service";
import { AmountService } from "./amount/amount.service";
import { FixedAmountService } from "./amount/fixed-amount.service";
import { TimeEntryResultFactory } from "./result.service";
describe('TimeEntryController', () => {
  let controller: TimeEntryController;
  let dataSource: TimeEntryMockDataSource;
  let spyFactory: jest.SpyInstance;
  let spyResult: jest.Mock;

  beforeEach(async () => {
    dataSource = new TimeEntryMockDataSource();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TimeEntryController],
      providers: [
        {
          provide: TimeEntryDataSource,
          useClass: TimeEntryMockDataSource
        },
        {
          provide: DurationService,
          useClass: ExactDurationService
        },
        {
          provide: AmountService,
          useClass: FixedAmountService
        },
        TimeEntryResultFactory
      ]
    }).compile();

    controller = app.get<TimeEntryController>(TimeEntryController);
    dataSource = app.get<TimeEntryMockDataSource>(TimeEntryDataSource);
    const resultFactoryProvider = app.get<TimeEntryResultFactory>(TimeEntryResultFactory);

    spyResult = jest.fn().mockReturnValue({});
    spyFactory = jest.spyOn(resultFactoryProvider, 'getFactory');
    spyFactory.mockReturnValue(spyResult);
  });

  describe('list', () => {
    it('should return a list of elements', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toString(),
          description: 'Test1',
          start: new Date(),
          end: new Date(),
          billable: true
        },
        {
          id: new Types.ObjectId().toString(),
          description: 'Test2',
          start: new Date(),
          end: new Date(),
          billable: true
        }
      ];
      dataSource.setRecords(records);
      return controller.list()
        .then(results => {
          expect(spyFactory).toHaveBeenCalled();
          for(let i = 0; i < records.length; i++) {
            expect(spyResult).toHaveBeenNthCalledWith(i+1, records[i]);
          }
          expect(results.length).toBe(records.length);
        });
    });
  });

  describe('detail', () => {
    it('should return a single record"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toString(),
          description: 'Test1',
          start: new Date(),
          end: new Date(),
          billable: true
        },
        {
          id: new Types.ObjectId().toString(),
          description: 'Test2',
          start: new Date(),
          end: new Date(),
          billable: true
        }
      ];
      dataSource.setRecords(records);

      return controller.detail(records[1].id.toString()).then(result => {
        expect(spyFactory).toHaveBeenCalled();
        expect(spyResult).toHaveBeenCalledWith(records[1]);
        expect(result).toStrictEqual({});
      });
    });

    it('should throw an exception if not found"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toString(),
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: false
        }
      ];
      dataSource.setRecords(records);
      return expect(controller.detail('test')).rejects.toThrow('Not found');
    });

  });

  describe('create', () => {
    it('should add a new record', async () => {
      const record = {
        description: 'Test1',
        start: new Date('2024-01-10T10:00:00.000Z'),
        end: new Date('2024-01-10T11:00:00.000Z'),
        billable: true
      };
      
      return controller.create(record).then(result =>{
        expect(spyFactory).toHaveBeenCalled();
        expect(spyResult).toHaveBeenCalled();
        expect(result).toStrictEqual({});
      });
    });
  })
});
import { Test, TestingModule } from "@nestjs/testing";
import { TimeEntryController } from "./time-entry.controller";
import { Types } from "mongoose";
import { AmountService } from "./amount/amount.service";
import { FixedAmountService } from "./amount/fixed-amount.service";
import { TimeEntryResultFactory } from "./result.service";
import { DurationSettingsDataSource, DurationSettingsStaticDataSource } from "@modules/duration/duration-settings";
import { DurationStrategySelectorService, ExactDurationService } from "@modules/duration/duration-strategy";
import { TimeEntryMockDataSource, TimeEntryDataSource, TimeEntry } from "@modules/time-entry";
describe('TimeEntryController', () => {
  let controller: TimeEntryController;
  let dataSource: TimeEntryMockDataSource;
  let spyDurationSettings: jest.SpyInstance;
  let spyStrategyProvider: jest.SpyInstance;
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
          provide: AmountService,
          useClass: FixedAmountService
        },
        TimeEntryResultFactory,
        {
          provide: DurationSettingsDataSource,
          useClass: DurationSettingsStaticDataSource
        },
        DurationStrategySelectorService
      ]
    }).compile();

    controller = app.get<TimeEntryController>(TimeEntryController);
    dataSource = app.get<TimeEntryMockDataSource>(TimeEntryDataSource);

    const durationSettings = app.get<DurationSettingsDataSource>(DurationSettingsDataSource);
    spyDurationSettings = jest.spyOn(durationSettings, 'getDurationSettings').mockResolvedValue({strategy: 'exact'});

    const durationStrategyProvider = app.get<DurationStrategySelectorService>(DurationStrategySelectorService);
    durationStrategyProvider.addStrategy('exact', new ExactDurationService());
    spyStrategyProvider = jest.spyOn(durationStrategyProvider, 'getStrategy');

    const resultFactoryProvider = app.get<TimeEntryResultFactory>(TimeEntryResultFactory);

    spyResult = jest.fn().mockReturnValue({});
    spyFactory = jest.spyOn(resultFactoryProvider, 'getFactory');
    spyFactory.mockReturnValue(spyResult);
  });

  describe('duration strategy', () => {
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
    beforeEach(() => {
      dataSource.setRecords(records);
    })

    it('LIST: should call the settings provider', async () => {
      try {
        await controller.list();
      } catch (_) {}
      finally {
        expect(spyDurationSettings).toHaveBeenCalled();
      }
    })
    it('DETAIL: should call the settings provider', async () => {
      try {
        await controller.detail(records[0].id.toString());
      } catch (_) {}
      finally {
        expect(spyDurationSettings).toHaveBeenCalled();
      }
    })
    it('CREATE: should call the settings provider', async () => {
      try {
        const record = {
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: true
        }
        await controller.create(record);
      } catch (_) {}
      finally {
        expect(spyDurationSettings).toHaveBeenCalled();
      }
    })

    it('LIST: should request the right duration strategy', async () => {
      spyDurationSettings.mockResolvedValue({strategy: 'test'});
      try {
        await controller.list();
      } catch(_) {}
      finally {
        expect(spyStrategyProvider).toHaveBeenCalledWith('test');
      }
    })

    it('DETAIL: should request the right duration strategy', async () => {
      spyDurationSettings.mockResolvedValue({strategy: 'test'});
      try {
        await controller.detail(records[0].id.toString());
      } catch(_) {}
      finally {
        expect(spyStrategyProvider).toHaveBeenCalledWith('test');
      }
    })

    it('CREATE: should request the right duration strategy', async () => {
      spyDurationSettings.mockResolvedValue({strategy: 'test'});
      try {
        const record = {
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: true
        }
        await controller.create(record);
      } catch(_) {}
      finally {
        expect(spyStrategyProvider).toHaveBeenCalledWith('test');
      }
    })
  })

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
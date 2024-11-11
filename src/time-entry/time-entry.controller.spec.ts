import { Test, TestingModule } from "@nestjs/testing";
import { TimeEntryController } from "./time-entry.controller";
import { TimeEntryDataSource } from "./datasource/time-entry.ds";
import { TimeEntryMockDataSource } from "./datasource/time-entry.ds.mock.service";
import { Types } from "mongoose";
import { TimeEntry } from "./time-entry.schema";
describe('TimeEntryController', () => {
  let controller: TimeEntryController;
  let dataSource: TimeEntryMockDataSource;

  beforeEach(async () => {
    dataSource = new TimeEntryMockDataSource();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TimeEntryController],
      providers: [
        {
        provide: TimeEntryDataSource,
        useClass: TimeEntryMockDataSource
        }
      ]
    }).compile();

    controller = app.get<TimeEntryController>(TimeEntryController);
    dataSource = app.get<TimeEntryMockDataSource>(TimeEntryDataSource);
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
          expect(results.length).toBe(records.length);
        });
    });

    it('should calc billable amounts', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toString(),
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: true
        },
        {
          id: new Types.ObjectId().toString(),
          description: 'Test2',
          start: new Date('2024-01-10T11:00:00.000Z'),
          end: new Date('2024-01-10T13:00:00.000Z'),
          billable: false
        },
        {
          id: new Types.ObjectId().toString(),
          description: 'Test2',
          start: new Date('2024-01-13T10:00:00.000Z'),
          end: new Date('2024-01-14T10:00:00.000Z'),
          billable: true
        },
        {
          id: new Types.ObjectId().toString(),
          description: 'Test3',
          start: new Date('2024-01-14T10:00:00.000Z'),
          end: new Date('2024-01-14T10:00:00.000Z'),
          billable: true
        }
      ];
      dataSource.setRecords(records);

      return controller.list().then(result => {      
        expect(result[0].amount).toBeGreaterThan(0);
        expect(result[1].amount).toBe(0);
        expect(result[2].amount).toBeGreaterThan(0);
        expect(result[3].amount).toBe(0);
      });
    });
  });

  describe('detail', () => {
    it('should return a single record with amount"', async () => {
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
        expect(result.id).toBe(records[1].id);
        expect(result.amount).toBeDefined();
      });
    });

    it('should calculate billable amounts"', async () => {
      const records: TimeEntry[] = [
        {
          id: new Types.ObjectId().toString(),
          description: 'Test1',
          start: new Date('2024-01-10T10:00:00.000Z'),
          end: new Date('2024-01-10T11:00:00.000Z'),
          billable: true
        }
      ];
      dataSource.setRecords(records);

      return controller.detail(records[0].id.toString()).then(result => {
        expect(result.amount).toBeGreaterThan(0);
      });
    });
    it('should leave non billable amounts to 0"', async () => {
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

      return controller.detail(records[0].id.toString()).then(result => {
        expect(result.amount).toBe(0);
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
    it('should add a new billable record', async () => {
      const record = {
        description: 'Test1',
        start: new Date('2024-01-10T10:00:00.000Z'),
        end: new Date('2024-01-10T11:00:00.000Z'),
        billable: true
      };
      return controller.create(record).then(result =>{
        expect(result.id).toBeDefined();
        expect(result.description).toBe(record.description);
        expect(result.billable).toBe(true);
        expect(result.amount).toBeGreaterThan(0);
      });
    });

    it('should add a new non billable record', async () => {
      const record = {
        description: 'Test1',
        start: new Date('2024-01-10T10:00:00.000Z'),
        end: new Date('2024-01-10T11:00:00.000Z'),
        billable: false
      };
      return controller.create(record).then(result =>{
        expect(result.id).toBeDefined();
        expect(result.description).toBe(record.description);
        expect(result.billable).toBe(false);
        expect(result.amount).toBe(0);
      });
    });
  })
});
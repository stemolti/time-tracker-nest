import { AmountService } from "./amount/amount.service";
import { FixedAmountService } from "./amount/fixed-amount.service";
import { Types } from "mongoose";
import { TimeEntryResultFactory } from "./result.service";
import { DurationService, ExactDurationService } from "@modules/duration/duration-strategy";
describe('TimeEntryResultFactory', () => {
  let amountSrv: AmountService;
  let durationSrv: DurationService;

  beforeEach(() => {
    amountSrv = new FixedAmountService();
    durationSrv = new ExactDurationService();
  });

  it('should return a billable result', () => {
    const record = {
      id: new Types.ObjectId().toString(),
      description: 'Test1',
      start: new Date('2024-01-10T10:00:00.000Z'),
      end: new Date('2024-01-10T11:00:00.000Z'),
      billable: true
    };

    const factoryProvider = new TimeEntryResultFactory();
    const durationSpy = jest.spyOn(durationSrv, 'getDuration').mockReturnValue(1);
    const amountSpy = jest.spyOn(amountSrv, 'calcAmount');

    const resultFactory = factoryProvider.getFactory(durationSrv, amountSrv);
    const result = resultFactory(record);

    expect(durationSpy).toHaveBeenCalledWith(record.start, record.end);
    expect(amountSpy).toHaveBeenCalledWith(1);
    expect(result.amount).toBeGreaterThan(0);
  });

  it('should return a non billable result', () => {
    const record = {
      id: new Types.ObjectId().toString(),
      description: 'Test1',
      start: new Date('2024-01-10T10:00:00.000Z'),
      end: new Date('2024-01-10T11:00:00.000Z'),
      billable: false
    };

    const factoryProvider = new TimeEntryResultFactory();
    const amountSpy = jest.spyOn(amountSrv, 'calcAmount');

    const resultFactory = factoryProvider.getFactory(durationSrv, amountSrv);
    const result = resultFactory(record);

    expect(amountSpy).not.toHaveBeenCalled();
    expect(result.amount).toBe(0);
  });
});
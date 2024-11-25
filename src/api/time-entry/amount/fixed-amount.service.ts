import { Injectable } from "@nestjs/common";
import { AmountService } from "./amount.service";

@Injectable()
export class FixedAmountService extends AmountService {
  constructor(protected hourlyRate: number = 60) {
    super();
  }

  calcAmount(duration: number): number {
    return duration * this.hourlyRate;
  }

}
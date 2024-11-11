import { Injectable } from "@nestjs/common";
import { AmountService } from "./amount.service";

@Injectable()
export class FixedAmountService extends AmountService {
  calcAmount(duration: number): number {
    return duration * 60;
  }

}
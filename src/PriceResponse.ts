import { Price } from './repository';

export class PriceResponse {
  base: string;
  target: string;
  price: number;
  std_deviation: number;
  rank: number;
  updated_at: Date;

  constructor(price: Price) {
    this.base = price.base_symbol;
    this.target = price.target_symbol;
    this.price = price.price;
    this.std_deviation = price.std_deviation;
    this.rank = price.rank;
    this.updated_at = price.created_at;
  }
}
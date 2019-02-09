import {Product} from './product';

export interface Purchase {
  id: number;
  product_id: number;
  product?: Product;
  timestamp: Date;
  amount: number;
  price: number;
  revoked: boolean;
}

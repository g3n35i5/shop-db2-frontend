import { Product } from './product';
import { User } from './user';

export interface Purchase {
  id: number;
  product_id: number;
  product?: Product;
  user_id: number;
  user?: User;
  timestamp: Date;
  amount: number;
  price: number;
  revoked: boolean;
}

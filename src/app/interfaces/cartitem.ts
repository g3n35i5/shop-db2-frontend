import {Product} from '../classes/product';

export interface CartItem {
  product: Product;
  count: number;
}

import { User } from './user';
import { Product } from './product';
import { CartItem } from './cartitem';
import { Tag } from './tag';

export interface CartState {
  loaded: boolean;
  disableInput: boolean;
  user: User;
  products: Product[];
  favorites: number[];
  cart: CartItem[];
  tags: Tag[];
}

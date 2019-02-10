
import {User} from './user';
import {Product} from './product';
import {Tag} from './tag';

export interface ShopState {
  loaded: boolean;
  user: User;
  products: Product[];
  favorites: number[];
  tags: Tag[];
}

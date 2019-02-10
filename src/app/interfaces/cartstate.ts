import {CartItem} from './cartitem';

export interface CartState {
  cart: CartItem[];
  disableInput: boolean;
}

import {Component, OnInit} from '@angular/core';
import {ShopService} from '../shop.service';
import {CartState} from '../../interfaces/cartstate';
import {Subscription} from 'rxjs';
import {CartItem} from '../../interfaces/cartitem';
import {User} from '../../classes/user';
import {ShopState} from '../../interfaces/shopstate';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  private shopSubscription: Subscription;
  private cartSubscription: Subscription;
  public cart: CartItem[];
  public user: User;
  public loaded: boolean;
  public disableInput: boolean;

  constructor(
    private shopService: ShopService
  ) {
  }

  ngOnInit() {
    this.shopSubscription = this.shopService.shopState.subscribe((state: ShopState) => {
      this.loaded = state.loaded;
      this.user = state.user;
    });

    this.cartSubscription = this.shopService.cartState.subscribe((state: CartState) => {
      this.disableInput = state.disableInput;
      this.cart = state.cart;
    });
  }

  shoppingCartSum(): number {
    return this.shopService.shoppingCartSum();
  }

  creditAfterPurchase(): number {
    return this.shopService.creditAfterPurchase();
  }

  deleteCart(): void {
    this.shopService.deleteCart();
  }

  submitCart(): void {
    this.shopService.submitCart();
  }

  getAvatarString(): string {
    return this.shopService.getUsernameUmlautFree();
  }

  cartIsEmpty(): boolean {
    return this.shopService.cartIsEmpty();
  }
}

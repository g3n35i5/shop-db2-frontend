import { Component, OnInit } from '@angular/core';
import {ShopService} from '../shop.service';
import {CartState} from '../../interfaces/cartstate';
import {Subscription} from 'rxjs';
import {CartItem} from '../../interfaces/cartitem';
import {User} from '../../interfaces/user';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  private subscription: Subscription;
  public cart: CartItem[];
  public user: User;
  public loaded: boolean;
  public disableInput: boolean;

  constructor(
    private shopService: ShopService
  ) {}

  ngOnInit() {
    this.subscription = this.shopService.State.subscribe((state: CartState) => {
      this.loaded = state.loaded;
      this.user = state.user;
      this.cart = state.cart;
      this.disableInput = state.disableInput;
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

  preventPurchase(): boolean {
    return this.shopService.preventPurchase();
  }

  getDebtLimit(): number {
    return this.shopService.getDebtLimit();
  }

  getUsername(): string {
    return this.shopService.getUsername();
  }

  cartIsEmpty(): boolean {
    return this.shopService.cartIsEmpty();
  }
}

import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Product } from '../interfaces/product';
import { Rank } from '../interfaces/rank';
import { CartItem } from '../interfaces/cartitem';
import { CartState } from '../interfaces/cartstate';
import { Tag } from '../interfaces/tag';
import { DataService } from '../services/data.service';
import {forkJoin, Observable, Subject, Subscription} from 'rxjs';
import { map } from 'rxjs/operators';
import {SettingsService} from '../settings/settings.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private userID: number;
  private loaded: boolean;
  private disableInput: boolean;
  private user: User;
  private products: Product[];
  private favorites: number[];
  private cart: CartItem[];
  private ranks: Rank[];
  private tags: Tag[];
  private cartSubject = new Subject<CartState>();
  State = this.cartSubject.asObservable();

  constructor(
    private dataService: DataService,
    private settingsService: SettingsService,
    private router: Router
  ) {
    this.cartSubject.next({
      loaded: false,
      disableInput: true,
      user: null,
      products: null,
      favorites: null,
      cart: null,
      tags: null
    });
  }

  public switchUser(id: number): void {
    this.userID = id;
    this.reloadData();
  }

  private publishSubject(): void {
    this.disableInput = false;
    this.cartSubject.next({
      loaded: this.loaded,
      disableInput: this.disableInput,
      user: this.user,
      products: this.products,
      favorites: this.favorites,
      tags: this.tags,
      cart: this.cart
    });
  }

  private reloadData(): void {
    const user = this.dataService.getUser(this.userID);
    const products = this.dataService.getProducts();
    const favorites = this.dataService.getFavorites(this.userID);
    const ranks = this.dataService.getRanks();
    const tags = this.dataService.getTags();
    forkJoin([user, products, favorites, ranks, tags]).subscribe(results => {
      this.loaded = true;
      this.user = results[0];
      this.products = results[1];
      this.favorites = results[2];
      this.ranks = results[3];
      this.tags = results[4];
      this.cart = [];
      this.publishSubject();
    });
  }

  /**
   * Adds a product to the shopping cart.
   * @param product is the item to be added to the cart.
   */
  addProduct(product: Product) {
    const item: CartItem = this.cart.find(c => c.product === product);
    if (!item) {
      this.cart.push({product: product, count: 1});
    } else {
      item.count ++;
    }
    this.publishSubject();
  }

  /**
   * Removes a product from the shopping cart.
   * @param product is the item to be removed.
   */
  removeProduct(product: Product) {
    const item: CartItem = this.cart.find(c => c.product === product);
    if (item) {
      if (item.count === 1) {
        this.cart = this.cart.filter((_item) =>  _item.product !== product);
      } else {
        item.count --;
      }
    }
    this.publishSubject();
  }


  getUsername(): string {
    return this.dataService.getUsername(this.user);
  }

  /**
   * Delete all items in the shopping cart.
   */
  deleteCart(): void {
    this.cart = [];
    this.publishSubject();
  }

  /**
   * Submit the shopping cart.
   */
  submitCart(): void {
    this.disableInput = true;
    this.publishSubject();
    const requests = [];
    for (const item of this.cart) {
      const data = { user_id: this.user.id, product_id: item.product.id, amount: item.count };
      requests.push(this.dataService.createPurchase(data));
    }
    forkJoin(requests).subscribe(() => {
      if (this.settingsService.getStateByID('redirectAfterPurchase')) {
        this.router.navigate(['/']);
      } else {
        this.deleteCart();
        this.reloadData();
        this.disableInput = false;
        this.publishSubject();
      }
    }, () => {
      this.disableInput = false;
      this.publishSubject();
    });
  }

  /**
   * Get the count of a product in the cart.
   */
  productCountInCart(product: Product): number {
    const item = this.cart.find(c => c.product.id === product.id);
    return item ? item.count : 0;
  }

  /**
   * Get the image url for a product.
   */
  imageURL(product: Product) {
    const path = '/api/images/';
    return product.imagename !== null ? path + product.imagename : path;
  }

  /**
   * Returns the credit of the user after he or she makes the purchase.
   */
  creditAfterPurchase(): number {
    return this.user.credit - this.shoppingCartSum();
  }

  getDebtLimit(): number {
    return this.ranks.find(r => r.id === this.user.rank_id).debt_limit;
  }

  /**
   * Indicates whether to prevent the purchase. This is to happen if the
   * user's credit balance falls below the permitted limit after the purchase.
   **/
  preventPurchase() {
    return this.creditAfterPurchase() < this.getDebtLimit();
  }

  /** Indicates whether to disable the buy button. **/
  disableBuyButton() {
    // return this.preventPurchase() || this.disableInput;
    return false;
  }

  disableAddToCart(product: Product): boolean {
    return (this.creditAfterPurchase() - product.price < this.getDebtLimit());
  }

  /**
   * Returns the shopping cart sum.
   */
  shoppingCartSum(): number {
    return this.cart.map(i => i.count * i.product.price).reduce((a, b) => a + b, 0);
  }

  /** Indicates whether the shopping cart is empty. **/
  cartIsEmpty(): boolean {
    return this.cart.length === 0;
  }

  /**
   * Returns the number of items in the shopping cart.
   */
  numberOfCartItems(): number {
    return this.cart.map(i => i.count).reduce((a, b) => a + b, 0);
  }
}

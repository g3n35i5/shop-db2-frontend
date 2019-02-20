import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Product } from '../interfaces/product';
import { Rank } from '../interfaces/rank';
import { CartItem } from '../interfaces/cartitem';
import { CartState } from '../interfaces/cartstate';
import { Tag } from '../interfaces/tag';
import { DataService } from '../services/data.service';
import { forkJoin, Subject } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { Router } from '@angular/router';
import { ShopState } from '../interfaces/shopstate';
import { environment } from '../../environments/environment';

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
  private shopSubject = new Subject<ShopState>();
  private cartSubject = new Subject<CartState>();
  shopState = this.shopSubject.asObservable();
  cartState = this.cartSubject.asObservable();

  constructor(
    private dataService: DataService,
    private settingsService: SettingsService,
    private router: Router
  ) {
    this.shopSubject.next({
      loaded: false,
      user: null,
      products: null,
      favorites: null,
      tags: null
    });

    this.cartSubject.next({
      disableInput: true,
      cart: []
    });
  }

  public switchUser(id: number): void {
    this.userID = id;
    this.reloadData();
  }

  private publishShop(): void {
    this.shopSubject.next({
      loaded: true,
      user: this.user,
      products: this.products,
      favorites: this.favorites,
      tags: this.tags
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
      this.publishShop();
    });
  }

  /**
   * Adds a product to the shopping cart.
   * @param product is the item to be added to the cart.
   */
  addProduct(product: Product) {
    this.cartSubject.next({disableInput: true, cart: this.cart});
    const item: CartItem = this.cart.find(c => c.product === product);
    if (!item) {
      this.cart.push({product: product, count: 1});
    } else {
      item.count ++;
    }
    this.cartSubject.next({disableInput: false, cart: this.cart});
  }

  /**
   * Removes a product from the shopping cart.
   * @param product is the item to be removed.
   */
  removeProduct(product: Product) {
    this.cartSubject.next({disableInput: true, cart: this.cart});
    const item: CartItem = this.cart.find(c => c.product === product);
    if (item) {
      if (item.count === 1) {
        this.cart = this.cart.filter((_item) =>  _item.product !== product);
      } else {
        item.count --;
      }
    }
    this.cartSubject.next({disableInput: false, cart: this.cart});
  }


  getUsername(): string {
    return this.dataService.getUsername(this.user);
  }

  /**
   * Delete all items in the shopping cart.
   */
  deleteCart(): void {
    this.cart = [];
    this.cartSubject.next({disableInput: false, cart: this.cart});
  }

  /**
   * Submit the shopping cart.
   */
  submitCart(): void {
    this.cartSubject.next({disableInput: true, cart: this.cart});
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
        this.cartSubject.next({disableInput: false, cart: this.cart});
      }
    }, () => {
      this.cartSubject.next({disableInput: false, cart: this.cart});
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
    const path = environment.apiURL + 'images/';
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

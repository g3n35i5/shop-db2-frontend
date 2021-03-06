import {Injectable} from '@angular/core';
import {User} from '../classes/user';
import {Product} from '../classes/product';
import {Rank} from '../interfaces/rank';
import {CartItem} from '../interfaces/cartitem';
import {CartState} from '../interfaces/cartstate';
import {Tag} from '../interfaces/tag';
import {DataService} from '../services/data.service';
import {forkJoin, Subject} from 'rxjs';
import {SettingsService} from '../settings/settings.service';
import {Router} from '@angular/router';
import {ShopState} from '../interfaces/shopstate';
import {environment} from '../../environments/environment';
import {HttpParams} from '@angular/common/http';

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
    // Only products that are active should be displayed in the frontend.
    this.products = this.products.filter(p => p.active);
    // Publish the shop subject.
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
    // Filter params for tags
    const tagParams = new HttpParams().set('filter', JSON.stringify({is_for_sale: true}))
    const tags = this.dataService.getTags(tagParams);
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
    if (this.disableAddToCart(product)) {
      this.cartSubject.next({disableInput: this.preventPurchase(), cart: this.cart});
      return;
    }
    if (!item) {
      this.cart.push({product: product, count: 1});
    } else {
      item.count++;
    }
    this.cartSubject.next({disableInput: this.preventPurchase(), cart: this.cart});
  }

  /**
   * Removes a product from the shopping cart.
   * @param product is the item to be removed.
   */
  removeProduct(product: Product) {
    this.cartSubject.next({disableInput: true, cart: this.cart});
    if (this.disableRemoveFromCart(product)) {
      this.cartSubject.next({disableInput: this.preventPurchase(), cart: this.cart});
      return;
    }
    const item: CartItem = this.cart.find(c => c.product === product);
    if (item) {
      if (item.count === 1) {
        this.cart = this.cart.filter((_item) => _item.product !== product);
      } else {
        item.count--;
      }
    }
    this.cartSubject.next({disableInput: this.preventPurchase(), cart: this.cart});
  }

  getUsernameUmlautFree(): string {
    return this.dataService.replaceUmlauts(this.user.getUsername());
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
  async submitCart(): Promise<void> {
    this.cartSubject.next({disableInput: true, cart: this.cart});
    const requests = [];

    // We need to sort the purchases in the card by the resulting price in ascending order.
    // This resolves the following issue: https://github.com/g3n35i5/shop-db2-frontend/issues/7
    this.cart.sort(this._cart_sort_fn);

    let errorCounter = 0;

    for (const item of this.cart) {
      const data = {user_id: this.user.id, product_id: item.product.id, amount: item.count};

      try {
        await this.dataService.createPurchase(data).toPromise();
      } catch (e) {
        errorCounter++;
        continue;
      }

      // Remove successfully inserted cart item from the cart
      this.cart = this.cart.filter((cartItem: CartItem) => cartItem !== item);
    }

    if (errorCounter === 0 && this.settingsService.getStateByID('redirectAfterPurchase')) {
      await this.router.navigate(['/']);
    } else {
      this.disableInput = false;
      this.cartSubject.next({disableInput: this.preventPurchase(), cart: this.cart});
    }
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

  /**
   * Indicates whether to prevent the purchase of a specific product.
   */
  disableAddToCart(product: Product): boolean {
    return (this.creditAfterPurchase() - product.price < this.getDebtLimit());
  }

  /**
   * Indicates whether to prevent the removal of a specific product from the cart.
   */
  disableRemoveFromCart(product: Product): boolean {
    return (this.creditAfterPurchase() + product.price < this.getDebtLimit());
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

  /**
   * Returns whether the given product is not older than a given number
   * of days (currently one week).
   */
  productIsNew(product: Product): boolean {
    const now = new Date();
    const productCreationDate = product.creation_date.toDate();
    const difference = Math.abs(now.getTime() - productCreationDate.getTime());
    const productAgeInDays = Math.ceil(difference / (1000 * 3600 * 24));
    return productAgeInDays <= 7;
  }

  /**
   * Sort function for the cart. All items have to be sorted by the sum price of the purchase in ascending order.
   */
  _cart_sort_fn(first: CartItem, second: CartItem): number {
    const resultingPriceFirst = first.product.price * first.count;
    const resultingPriceSecond = second.product.price * second.count;
    if (resultingPriceFirst > resultingPriceSecond) {
      return 1;
    } else if (resultingPriceFirst < resultingPriceSecond) {
      return -1;
    }
    return 0;
  }
}

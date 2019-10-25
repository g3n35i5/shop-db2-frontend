import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ShopService} from '../shop.service';
import {Subscription} from 'rxjs';
import {Product} from '../../classes/product';
import {Tag} from '../../interfaces/tag';
import {ShopState} from '../../interfaces/shopstate';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  private shopSubscription: Subscription;

  // The regex pattern only accepts numbers followed by the string 'Enter'
  private barcodePattern: RegExp = new RegExp('^[0-9]+Enter');
  private barcodeScannerInput: string[];
  private barcodeScannerPressed: boolean;

  public searchText = '';
  public products: Product[];
  private favorites: number[];
  public filtered: Product[];
  public tags: Tag[];
  public loaded: boolean;
  public showFavorites: boolean;

  constructor(
    private shopService: ShopService
  ) {
    this.showFavorites = true;
    this.barcodeScannerPressed = false;
    this.barcodeScannerInput = [];
  }

  ngOnInit() {
    this.shopSubscription = this.shopService.shopState.subscribe((state: ShopState) => {
      this.loaded = state.loaded;
      this.products = state.products;
      this.favorites = state.favorites;
      this.tags = state.tags;
      this.enableFavorites();
    });
  }

  ngOnDestroy() {
    this.shopSubscription.unsubscribe();
  }

  /**
   * Handle keyboard inputs for the barcode scanner.
   * @param event is the keyboard input event.
   */
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.barcodeScannerInput.push(event.key);
    if (this.barcodeScannerPressed === false) {
      setTimeout(() => {
        let barcode = this.barcodeScannerInput.join('');
        if (this.barcodePattern.test(barcode)) {
          barcode = barcode.replace('Enter', '');
          const product = this.products.find(p => p.barcode === barcode);
          if (product) {
            this.shopService.addProduct(product);
          }
        }
        this.barcodeScannerInput = [];
        this.barcodeScannerPressed = false;
      }, 100);
      this.barcodeScannerPressed = true
      ;
    }
  }

  /**
   * When called, the favorites get shown.
   */
  enableFavorites(): void {
    this.showFavorites = true;
    const trimmedFavorites = this.favorites.slice(0, Math.min(...[10, this.favorites.length]));
    this.filtered = [];
    trimmedFavorites.forEach(id => {
      const product = this.products.find(p => p.id === id);
      if (product) {
        this.filtered.push(product);
      }
    });
  }

  /**
   * Applies the tag as filter to the product list.
   */
  filterProducts(tag: Tag): void {
    this.showFavorites = false;
    this.filtered = this.products
      .filter(product => product.tags.indexOf(tag.id) >= 0)
      .sort((p1, p2) => {
        return p1.name.toUpperCase().localeCompare(p2.name.toUpperCase());
      });
  }

  /**
   * Checks whether any product assigned to the given tag is new.
   */
  tagHasNewProduct(tag: Tag): boolean {
    const that = this;
    return this.products.filter(
      product => product.tags.indexOf(tag.id) >= 0)
      .some(function (product) {
        return that.shopService.productIsNew(product);
      });
  }

  /**
   * A boolean which indicates whether to show the reset search button.
   */
  showResetSearchButton(): boolean {
    return this.searchText !== '';
  }

  /**
   * Reset the search input and show the favorites.
   */
  resetSearch(): void {
    this.searchText = '';
    this.enableFavorites();
  }

  /**
   * This function gets called each time the search value changes.
   */
  private _searchProducts(): void {
    const filterValue = this.searchText.toLowerCase();
    if (filterValue === '') {
      this.resetSearch();
    } else {
      this.showFavorites = false;
      this.filtered = this.products.filter(p => p.name.toLowerCase().includes(filterValue));
    }
  }
}

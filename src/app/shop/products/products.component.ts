import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShopService } from '../shop.service';
import { CartState } from '../../interfaces/cartstate';
import { Subscription } from 'rxjs';
import { Product } from '../../interfaces/product';
import { Tag } from '../../interfaces/tag';
import {ShopState} from '../../interfaces/shopstate';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  private shopSubscription: Subscription;

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
   * When called, the favorites get shown.
   */
  enableFavorites(): void {
    this.showFavorites = true;
    this.filtered = this.products.filter(p => this.favorites.indexOf(p.id) >= 0);
  }

  /**
   * Applies the tag as filter to the product list.
   */
  filterProducts(tag: Tag): void {
    this.showFavorites = false;
    this.filtered = this.products.filter(product => product.tags.indexOf(tag.id) >= 0);
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
      this.filtered = this.products.filter(p => p.name.toLowerCase().indexOf(filterValue) === 0);
    }
  }
}

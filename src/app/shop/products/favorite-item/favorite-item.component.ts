import {Component, Input} from '@angular/core';
import {Product} from '../../../classes/product';
import {ShopService} from '../../shop.service';

@Component({
  selector: 'app-favorite-item',
  templateUrl: './favorite-item.component.html',
  styleUrls: ['./favorite-item.component.scss']
})

export class FavoriteItemComponent {

  @Input() product: Product;

  constructor(private shopService: ShopService) {
  }

  addToCart(product: Product): void {
    this.shopService.addProduct(product);
  }

  removeFromCart(product: Product): void {
    this.shopService.removeProduct(product);
  }

  imageURL(product: Product) {
    return this.shopService.imageURL(product);
  }

  productCountInCart(product: Product) {
    return this.shopService.productCountInCart(product);
  }

  disableAddToCart(product: Product): boolean {
    return this.shopService.disableAddToCart(product);
  }
}

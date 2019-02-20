import { Component, Input } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent {

  @Input()product: Product;
  @Input()hideImageOnSmallScreens = false;
  constructor(private shopService: ShopService) {}

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

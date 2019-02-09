import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CreditwarningComponent } from './dialogs/creditwarning/creditwarning.component';
import { ShopService } from './shop.service';
import { Subscription } from 'rxjs';
import { CartItem } from '../interfaces/cartitem';
import { CartState } from '../interfaces/cartstate';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {

  private userID: number;
  private subscription: Subscription;

  public loaded: boolean;
  public cart: CartItem[];
  public user: User;

  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.params.subscribe(params => {
      this.userID = params['id'];
      this.shopService.switchUser(this.userID);
    });
}

  ngOnInit() {
    this.subscription = this.shopService.State.subscribe((state: CartState) => {
      this.loaded = state.loaded;
      this.cart = state.cart;
      this.user = state.user;
      if (this.user.credit < 0) {
        this.openCreditWarning();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  numberOfCartItems(): number {
    return this.shopService.numberOfCartItems();
  }

  cartIsEmpty(): boolean {
    return this.shopService.cartIsEmpty();
  }

  getUsername(): string {
    return this.shopService.getUsername();
  }

  /** Opens the credit warning dialog. **/
  openCreditWarning(): void {
    const dialogRef = this.dialog.open(CreditwarningComponent, {
      width: '400px',
      data: {
        credit: this.user.credit,
        debtLimit: this.shopService.getDebtLimit()
      },
      disableClose: true
    });
  }
}
